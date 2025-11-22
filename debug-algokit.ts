import { AlgorandClient } from '@algorandfoundation/algokit-utils';
import algosdk from 'algosdk';

// ===== CONFIG =====
const ALGOD_URL = "https://testnet-api.algonode.cloud";
const INDEXER_URL = "https://testnet-idx.algonode.cloud";
const MAIN_APP_ID = 749655317n;

async function debug() {
    console.log("🚀 Starting Debug Script with AlgoKit (v2)...");

    const algorand = AlgorandClient.testNet();

    try {
        // Get box names
        console.log(`\n📦 Fetching Boxes for App ID ${MAIN_APP_ID}...`);
        const boxNames = await algorand.app.getBoxNames(MAIN_APP_ID);
        console.log(`Found ${boxNames.length} boxes.`);

        if (boxNames.length > 0) {
            console.log("First Box Name Object:", JSON.stringify(boxNames[0], null, 2));
        }

        for (const box of boxNames) {
            // box is likely { name: { nameRaw: Uint8Array, ... } } or just { nameRaw: ... }
            // Let's try to handle it safely
            let nameRaw: Uint8Array | undefined;

            if (box.nameRaw) {
                nameRaw = box.nameRaw;
            } else if (box.name && box.name.nameRaw) {
                nameRaw = box.name.nameRaw;
            } else if (box.name instanceof Uint8Array) {
                nameRaw = box.name;
            } else {
                // Fallback: maybe it's just the object itself if it's an array of bytes?
                // console.log("Unknown box structure:", box);
                continue;
            }

            if (nameRaw) {
                const nameHex = Buffer.from(nameRaw).toString('hex');
                console.log(`\nBox Name (Hex): ${nameHex}`);

                const boxValue = await algorand.app.getBoxValue(MAIN_APP_ID, nameRaw);
                console.log(`Content Length: ${boxValue.length}`);
                console.log(`Content (Hex): ${Buffer.from(boxValue).toString('hex')}`);

                // Try to decode if it matches the structure we saw earlier
                // Structure seems to be:
                // [32 bytes Address] [8 bytes uint64?] [String URL?]

                if (boxValue.length > 32) {
                    const addrBytes = boxValue.slice(0, 32);
                    const addr = algosdk.encodeAddress(addrBytes);
                    console.log(`Possible Address: ${addr}`);

                    // Try to decode the rest as strings
                    const rest = boxValue.slice(32);
                    // console.log(`Rest (String): ${Buffer.from(rest).toString('utf-8')}`);
                }
            }
        }

    } catch (e) {
        console.error("❌ Error:", e);
    }
}

debug();
