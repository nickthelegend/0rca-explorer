import algosdk from "algosdk";
import { AlgorandClient } from '@algorandfoundation/algokit-utils';

// ===== CONFIG =====
const ALGOD_URL = process.env.NEXT_PUBLIC_ALGOD_URL || "https://testnet-api.algonode.cloud";
const INDEXER_URL = process.env.NEXT_PUBLIC_INDEXER_URL || "https://testnet-idx.algonode.cloud";
const ALGOD_TOKEN = process.env.NEXT_PUBLIC_ALGOD_TOKEN || "";
const INDEXER_TOKEN = process.env.NEXT_PUBLIC_INDEXER_TOKEN || "";
const ALGOD_PORT = process.env.NEXT_PUBLIC_ALGOD_PORT || "";
const INDEXER_PORT = process.env.NEXT_PUBLIC_INDEXER_PORT || "";

const MAIN_APP_ID = 749655317;
const LOGGING_APP_ID = 749653154;
const PAGE_LIMIT = 18;

// ===== HELPERS =====
const algodClient = new algosdk.Algodv2(ALGOD_TOKEN, ALGOD_URL, ALGOD_PORT);
const indexerClient = new algosdk.Indexer(INDEXER_TOKEN, INDEXER_URL, INDEXER_PORT);

const algorand = AlgorandClient.testNet();

export interface AgentData {
  id: string;
  name: string;
  creatorName: string;
  description: string;
  createdAt: string;
  status: string;
  address: string;
}

// Helper to decode strings from ABI-encoded box content
function decodeBoxContent(content: Uint8Array): Partial<AgentData> {
  try {
    // Heuristic: Look for length-prefixed strings
    // ABI strings are [2-byte length][bytes]
    // We scan the buffer for reasonable length prefixes followed by printable characters

    const strings: string[] = [];
    let i = 0;

    // Skip potential header (offsets) - usually first few bytes are small integers
    // But we don't know the exact schema, so let's scan.

    while (i < content.length - 2) {
      // Read 2 bytes as length
      const len = (content[i] << 8) | content[i + 1];

      // Heuristic: Length should be reasonable (e.g., 1 to 200)
      // and i + 2 + len should be <= content.length
      if (len > 0 && len < 200 && i + 2 + len <= content.length) {
        // Check if bytes are printable ascii
        let isPrintable = true;
        for (let j = 0; j < len; j++) {
          const char = content[i + 2 + j];
          if (char < 32 || char > 126) {
            isPrintable = false;
            break;
          }
        }

        if (isPrintable) {
          const str = Buffer.from(content.slice(i + 2, i + 2 + len)).toString('utf-8');
          strings.push(str);
          i += 2 + len;
          continue;
        }
      }
      i++;
    }

    // Map found strings to fields based on order/content
    // Expected: Name, URL, Status
    let name = "Unknown Agent";
    let description = "Autonomous Agent on Algorand Testnet";
    let status = "active";

    if (strings.length > 0) name = strings[0];
    if (strings.length > 1) description = strings[1]; // URL as description
    if (strings.length > 2) status = strings[2];

    return { name, description, status };

  } catch (e) {
    console.warn("Failed to decode box content:", e);
    return {};
  }
}

// 1️⃣ Fetch bnVtYmVy (number of agents)
export async function fetchNumberOfAgents(): Promise<number> {
  try {
    const app = await algodClient.getApplicationByID(MAIN_APP_ID).do();
    const globalState = app.params.globalState || app.params["global-state"] || [];

    for (const state of globalState) {
      const keyBase64 = state.key;
      const key = Buffer.from(keyBase64, "base64").toString();
      if (key === "bnVtYmVy") {
        return Number(state.value.uint);
      }
    }
    return 0;
  } catch (error) {
    console.error("Error fetching number of agents:", error);
    return 0;
  }
}

// 2️⃣ Fetch Agents from Boxes
export async function fetchAgents(): Promise<AgentData[]> {
  try {
    const appId = BigInt(MAIN_APP_ID);

    // Get box names
    const boxNames = await algorand.app.getBoxNames(appId);

    const agents: AgentData[] = [];

    for (const box of boxNames) {
      try {
        // Fix: Access nameRaw correctly. 
        // box structure from algokit-utils might vary, but debug showed it has nameRaw property directly?
        // Or maybe it's box.name.nameRaw?
        // The user error said "Cannot use 'in' operator to search for 'length' in undefined" at box.name.nameRaw
        // This implies box.name is undefined.
        // Debug output showed: { "nameRaw": ... }
        // So we use box.nameRaw if available, or box.name.nameRaw safely.

        let nameRaw: Uint8Array;
        if ('nameRaw' in box) {
          nameRaw = (box as any).nameRaw;
        } else if (box.name && 'nameRaw' in box.name) {
          nameRaw = box.name.nameRaw;
        } else {
          console.warn("Unknown box name structure", box);
          continue;
        }

        const content = await algorand.app.getBoxValue(appId, nameRaw);

        // Decode content
        const decoded = decodeBoxContent(content);

        // Generate ID/Address
        // If we can't extract address from content (first 32 bytes?), use box name?
        // Box name is 8 bytes int.
        // Let's use a placeholder address if we can't find one, or derive from box name.
        // Actually, the previous debug showed content length 115 bytes.
        // It likely contains the address? 
        // But my heuristic decoder might skip binary address.

        // Let's assume the address is NOT in the box content as the first 32 bytes if it starts with offsets.
        // However, we need an ID.
        // Let's use the Box Name (Hex) as the ID for now if we don't have an address.
        const boxId = Buffer.from(nameRaw).toString('hex');
        const address = boxId; // Placeholder

        agents.push({
          id: address,
          name: decoded.name || `Agent ${boxId}`,
          creatorName: "Algorand",
          description: decoded.description || "Autonomous Agent",
          createdAt: new Date().toISOString(),
          status: decoded.status || "active",
          address: address
        });

      } catch (e) {
        console.warn(`Failed to process box:`, e);
      }
    }

    return agents;
  } catch (error) {
    console.error("Error fetching agents from boxes:", error);
    return [];
  }
}

// 3️⃣ Fetch logging contract transactions
export async function fetchLoggingTransactions(agents: string[], nextToken?: string) {
  try {
    let query = indexerClient.searchForTransactions()
      .applicationID(LOGGING_APP_ID)
      .limit(PAGE_LIMIT);

    if (nextToken) {
      query = query.nextToken(nextToken);
    }

    const res = await query.do();
    const txns = (res.transactions || [])
      .map((tx: any) => ({
        id: tx.id,
        sender: tx.sender,
        round: Number(tx["confirmed-round"]),
        timestamp: Number(tx["round-time"])
      }));

    return {
      transactions: txns,
      nextToken: res["next-token"]
    };
  } catch (error) {
    console.error("Error fetching logging transactions:", error);
    return { transactions: [], nextToken: null };
  }
}
