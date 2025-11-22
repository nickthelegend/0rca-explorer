import algosdk from "algosdk";

// ===== CONFIG =====
const ALGOD_URL = "https://testnet-api.algonode.cloud";
const INDEXER_URL = "https://testnet-idx.algonode.cloud";
const ALGOD_TOKEN = "";
const INDEXER_TOKEN = "";
const ALGOD_PORT = "";
const INDEXER_PORT = "";

const MAIN_APP_ID = 749655317;
const LOGGING_APP_ID = 749653154;

const algodClient = new algosdk.Algodv2(ALGOD_TOKEN, ALGOD_URL, ALGOD_PORT);
const indexerClient = new algosdk.Indexer(INDEXER_TOKEN, INDEXER_URL, INDEXER_PORT);

// Helper to handle BigInt serialization
const replacer = (key: string, value: any) =>
    typeof value === 'bigint' ? value.toString() : value;

async function debug() {
    console.log("🚀 Starting Debug Script (v2)...");

    // 1. Check Node Connection
    try {
        const status = await algodClient.status().do();
        console.log("✅ Algod Node Connected.");
    } catch (e) {
        console.error("❌ Failed to connect to Algod:", e);
        return;
    }

    // 2. Fetch Main App Global State
    console.log(`\n🔍 Fetching App ID ${MAIN_APP_ID} Global State...`);
    try {
        const app = await algodClient.getApplicationByID(MAIN_APP_ID).do();
        console.log("App Object Keys:", Object.keys(app));
        if (app.params) {
            console.log("App Params Keys:", Object.keys(app.params));
            // Try both kebab-case and camelCase
            const globalState = app.params["global-state"] || app.params.globalState;
            console.log("Global State found:", !!globalState);

            if (globalState) {
                for (const state of globalState) {
                    const keyBase64 = state.key;
                    const key = Buffer.from(keyBase64, "base64").toString();
                    console.log(`Key: ${key}, Value:`, JSON.stringify(state.value, replacer));
                }
            } else {
                console.log("Full App Params:", JSON.stringify(app.params, replacer, 2));
            }
        } else {
            console.log("App response:", JSON.stringify(app, replacer, 2));
        }

    } catch (e) {
        console.error("❌ Failed to fetch App:", e);
    }

    // 3. Fetch Agents (Accounts opted in)
    console.log(`\n🔍 Fetching Accounts opted into App ID ${MAIN_APP_ID}...`);
    try {
        const res = await indexerClient.searchAccounts()
            .applicationID(MAIN_APP_ID)
            .limit(10)
            .do();

        console.log(`Found ${res.accounts.length} accounts.`);
        if (res.accounts.length > 0) {
            console.log("First Account:", JSON.stringify(res.accounts[0], replacer, 2));
        }
    } catch (e) {
        console.error("❌ Failed to fetch accounts:", e);
    }

    // 4. Fetch Transactions from Logging App
    console.log(`\n🔍 Fetching Transactions for App ID ${LOGGING_APP_ID}...`);
    try {
        const res = await indexerClient.searchForTransactions()
            .applicationID(LOGGING_APP_ID)
            .limit(5)
            .do();

        console.log(`Found ${res.transactions.length} transactions.`);
        if (res.transactions.length > 0) {
            console.log("Sample Transaction:", JSON.stringify(res.transactions[0], replacer, 2));
        }
    } catch (e) {
        console.error("❌ Failed to fetch transactions:", e);
    }
}

debug();
