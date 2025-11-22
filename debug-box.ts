import algosdk from "algosdk";

// ===== CONFIG =====
const ALGOD_URL = "https://testnet-api.algonode.cloud";
const MAIN_APP_ID = 749655317;

const algodClient = new algosdk.Algodv2("", ALGOD_URL, "");

async function debug() {
    console.log("🚀 Inspecting Box Content...");

    // Box names are 8-byte integers: 0, 1, 2...
    // Let's check Box 0
    const boxIndex = 0;
    const boxName = new Uint8Array(8); // 64-bit integer 0
    // If it's big-endian or little-endian? Algorand usually uses BigEndian for uint64.
    // The debug output showed "0,0,0,0,0,0,0,0" which is 0.

    try {
        const boxResponse = await algodClient.getApplicationBoxByName(MAIN_APP_ID, boxName).do();
        const content = boxResponse.value;
        console.log(`\n📦 Box 0 Content (${content.length} bytes):`);
        console.log("Hex:", Buffer.from(content).toString('hex'));
        console.log("String:", Buffer.from(content).toString('utf-8')); // Might be garbage if binary

        // Heuristic Analysis
        // Address is 32 bytes.
        // If the first 32 bytes look like an address?
        if (content.length >= 32) {
            const addrBytes = content.slice(0, 32);
            const addr = algosdk.encodeAddress(addrBytes);
            console.log(`\nPossible Address at offset 0: ${addr}`);
        }

        // Check for strings (length prefixed?)
        // Algorand ABI encoding usually has length prefix (uint16) for strings.

    } catch (e) {
        console.error("❌ Failed to read Box 0:", e.message);
    }
}

debug();
