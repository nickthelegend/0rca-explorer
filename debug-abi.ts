import algosdk from "algosdk";
import { AlgorandClient } from '@algorandfoundation/algokit-utils';

// ===== CONFIG =====
const ALGOD_URL = "https://testnet-api.algonode.cloud";
const MAIN_APP_ID = 749655317n;

async function debug() {
    console.log("🚀 Starting ABI Debug Script (Attempt 2)...");

    const algorand = AlgorandClient.testNet();

    try {
        // Get box names
        console.log(`\n📦 Fetching Boxes for App ID ${MAIN_APP_ID}...`);
        const boxNames = await algorand.app.getBoxNames(MAIN_APP_ID);
        console.log(`Found ${boxNames.length} boxes.`);

        // Define ABI Type using string format as suggested by user
        // (string,string,uint64,uint64,uint64,string)
        const agentAbiType = algosdk.ABIType.from("(string,string,uint64,uint64,uint64,string)");

        for (const box of boxNames) {
            try {
                let nameRaw: Uint8Array;
                if ('nameRaw' in box) {
                    nameRaw = (box as any).nameRaw;
                } else if (box.name && 'nameRaw' in box.name) {
                    nameRaw = box.name.nameRaw;
                } else {
                    nameRaw = (box as any).name || new Uint8Array();
                }

                console.log(`\nDecoding Box: ${Buffer.from(nameRaw).toString('hex')}`);

                const boxValue = await algorand.app.getBoxValue(MAIN_APP_ID, nameRaw);
                console.log(`Raw Value Length: ${boxValue.length}`);

                const decoded = agentAbiType.decode(boxValue) as any;
                // Decoded is an array: [name, details, fixedPricing, createdAt, appID, creatorName]
                console.log("✅ Decoded Agent:", JSON.stringify(decoded, (_, v) => typeof v === 'bigint' ? v.toString() : v, 2));

                // Map to our interface
                const agent = {
                    name: decoded[0],
                    details: decoded[1],
                    fixedPricing: decoded[2].toString(),
                    createdAt: decoded[3].toString(),
                    appID: decoded[4].toString(),
                    creatorName: decoded[5]
                };
                console.log("Mapped Agent:", agent);

            } catch (e) {
                console.error(`❌ Failed to decode box:`, e.message);
            }
        }

    } catch (e) {
        console.error("❌ Error:", e);
    }
}

debug();
