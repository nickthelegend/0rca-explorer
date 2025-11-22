import algosdk from "algosdk";

// ===== CONFIG =====
const ALGOD_URL = "https://testnet-api.algonode.cloud";
const INDEXER_URL = "https://testnet-idx.algonode.cloud";
const MAIN_APP_ID = 749655317;

const algodClient = new algosdk.Algodv2("", ALGOD_URL, "");
const indexerClient = new algosdk.Indexer("", INDEXER_URL, "");

const replacer = (key: string, value: any) =>
    typeof value === 'bigint' ? value.toString() : value;

async function debug() {
    console.log("🚀 Starting Deep Debug Script...");

    const appAddr = algosdk.getApplicationAddress(MAIN_APP_ID);
    console.log(`App Address: ${appAddr}`);

    // 1. Check Boxes
    console.log("\n📦 Checking Boxes...");
    try {
        const boxes = await algodClient.getApplicationBoxes(MAIN_APP_ID).do();
        console.log(`Found ${boxes.boxes.length} boxes.`);
        for (const box of boxes.boxes) {
            const nameBase64 = box.name;
            const name = Buffer.from(nameBase64).toString(); // Box names are raw bytes
            console.log(`Box Name (Raw): ${nameBase64}, Decoded: ${name}`);

            // Read Box Content
            try {
                const content = await algodClient.getApplicationBoxByName(MAIN_APP_ID, box.name).do();
                console.log(`  -> Content Length: ${content.value.length}`);
                // Try to decode content if it looks like text
                // console.log(`  -> Content: ${Buffer.from(content.value).toString()}`);
            } catch (e) {
                console.log(`  -> Failed to read content`);
            }
        }
    } catch (e) {
        console.error("❌ Failed to fetch boxes:", e.message);
    }

    // 2. Check Assets created by App
    console.log("\n💎 Checking Assets created by App...");
    try {
        const res = await indexerClient.lookupAccountCreatedAssets(appAddr).do();
        const assets = res.assets || [];
        console.log(`Found ${assets.length} assets created by App.`);
        assets.forEach((a: any) => {
            console.log(`  -> Asset ID: ${a.index}, Name: ${a.params.name}, Unit: ${a.params['unit-name']}`);
        });
    } catch (e) {
        console.error("❌ Failed to fetch created assets:", e.message);
    }

    // 3. Check Transactions sent by App (Inner Txns?)
    console.log("\n📜 Checking Transactions sent by App...");
    try {
        const res = await indexerClient.searchForTransactions()
            .address(appAddr)
            .addressRole("sender")
            .limit(10)
            .do();

        console.log(`Found ${res.transactions.length} transactions sent by App.`);
        res.transactions.forEach((tx: any) => {
            console.log(`  -> TxID: ${tx.id}, Type: ${tx['tx-type']}`);
            if (tx['inner-txns']) {
                console.log(`     Has ${tx['inner-txns'].length} inner txns`);
            }
        });
    } catch (e) {
        console.error("❌ Failed to fetch app transactions:", e.message);
    }
}

debug();
