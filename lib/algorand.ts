import algosdk from "algosdk";

// ===== CONFIG =====
// Using AlgoNode as default which doesn't require API Key, but allowing overrides
const ALGOD_URL = process.env.NEXT_PUBLIC_ALGOD_URL || "https://testnet-api.algonode.cloud";
const INDEXER_URL = process.env.NEXT_PUBLIC_INDEXER_URL || "https://testnet-idx.algonode.cloud";
const ALGOD_TOKEN = process.env.NEXT_PUBLIC_ALGOD_TOKEN || "";
const INDEXER_TOKEN = process.env.NEXT_PUBLIC_INDEXER_TOKEN || "";
const ALGOD_PORT = process.env.NEXT_PUBLIC_ALGOD_PORT || "";
const INDEXER_PORT = process.env.NEXT_PUBLIC_INDEXER_PORT || "";

const MAIN_APP_ID = 749655317;  // Contract where bnVtYmVy is stored
const LOGGING_APP_ID = 749653154; // Logging contract
const PAGE_LIMIT = 18;

// ===== HELPERS =====
const algodClient = new algosdk.Algodv2(ALGOD_TOKEN, ALGOD_URL, ALGOD_PORT);
const indexerClient = new algosdk.Indexer(INDEXER_TOKEN, INDEXER_URL, INDEXER_PORT);

export interface AgentData {
  address: string;
  // Add other properties if we can fetch them, for now just address
}

export interface TransactionData {
  id: string;
  sender: string;
  round: number;
  timestamp: number;
  // Add other fields as needed
}

// 1️⃣ Fetch bnVtYmVy (number of agents)
export async function fetchNumberOfAgents(): Promise<number> {
  try {
    const app = await algodClient.getApplicationByID(MAIN_APP_ID).do();
    const globalState = app.params["global-state"];

    for (const state of globalState) {
      const key = Buffer.from(state.key, "base64").toString();
      if (key === "bnVtYmVy") {
        return state.value.uint;
      }
    }
    console.warn("'bnVtYmVy' not found in global state.");
    return 0;
  } catch (error) {
    console.error("Error fetching number of agents:", error);
    return 0;
  }
}

// 2️⃣ Get agent addresses (accounts opted-in)
export async function fetchAgentAccounts(limit = 1000): Promise<string[]> {
  try {
    const res = await indexerClient.searchAccounts()
      .applicationID(MAIN_APP_ID)
      .limit(limit)
      .do();

    const agents = res.accounts.map((a: any) => a.address);
    return agents;
  } catch (error) {
    console.error("Error fetching agent accounts:", error);
    return [];
  }
}

// 3️⃣ Fetch logging contract transactions from those agents (paged)
export async function fetchLoggingTransactions(agents: string[], nextToken?: string) {
  try {
    let query = indexerClient.searchForTransactions()
      .applicationID(LOGGING_APP_ID)
      .limit(PAGE_LIMIT);

    if (nextToken) {
      query = query.nextToken(nextToken);
    }

    const res = await query.do();

    // Filter by agents if needed, but doing it client-side/in-memory might be heavy if many txns.
    // However, indexer doesn't support filtering by "sender in list".
    // If we want ONLY txns from agents, we might need to filter.
    // The user said "list of transactions that are coming from that agents Contract".
    // If the logging contract ONLY records relevant txns, maybe we don't need to filter strictly?
    // But the user's snippet does filter: `const txns = res.transactions.filter(tx => agents.includes(tx.sender));`
    // Note: This filter applies AFTER fetching a page. If a page has 18 txns and none are from agents, we return empty?
    // That might break pagination UX (empty pages).
    // For now, I will follow the user's snippet logic.
    
    const txns = res.transactions
      .filter((tx: any) => agents.includes(tx.sender))
      .map((tx: any) => ({
        id: tx.id,
        sender: tx.sender,
        round: tx["confirmed-round"],
        timestamp: tx["round-time"]
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
