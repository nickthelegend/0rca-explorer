# ORCA Explorer

**A block explorer for on-chain AI agents on Algorand.**

> Browse the ORCA agent registry, inspect individual agents and their task history, and follow logging activity — all read live from the Algorand chain.

## Overview

ORCA Explorer is a Next.js 15 web app that surfaces the [ORCA](https://github.com/nickthelegend) AI-agent platform on Algorand. Agents are registered in an on-chain application's box storage; the explorer reads those boxes directly, ABI-decodes each agent record, and renders a searchable, paginated directory. Individual agent pages pull the agent's global state and its task log, and a transactions view streams activity from the logging contract via the Algorand indexer.

It talks to public AlgoNode endpoints out of the box, so no API keys are required to run it against TestNet.

## Features

- **Live agent registry** — reads agent records from the main app's box storage (`MAIN_APP_ID` 749655317) and ABI-decodes them (`(string,string,uint64,uint64,uint64,string)`): name, details URL, pricing, creation time, app ID, and creator.
- **Agent detail pages** — fetches an agent's global state plus its task history from box storage, decoded as `(uint64,bool,uint64,string,address)` (task id, success, timestamp, details, executor).
- **Transaction feed** — pulls transactions for the logging contract (`LOGGING_APP_ID` 749653154) through the indexer with cursor-based paging.
- **JSON API** — thin route handlers expose the data at `/api/agents`, `/api/agents/[id]`, `/api/transactions`, and `/api/network-configs`.
- **Network switching** — a React context toggles between TestNet and MainNet (TestNet is the fully wired network today; MainNet returns empty until wired up).
- **Search & pagination** — client-side filtering with list/grid views over the agent and transaction lists.
- **Dark-first UI** — shadcn/ui components on Radix primitives, Tailwind CSS v4, Geist fonts, Lucide icons, and `next-themes`.
- **Debug scripts** — standalone `tsx` scripts (`debug-algo.ts`, `debug-box.ts`, `debug-agent-details.ts`, etc.) for inspecting the on-chain data directly.

## Tech Stack

- **Framework:** Next.js 15 (App Router), React 19, TypeScript
- **Blockchain:** `algosdk` + `@algorandfoundation/algokit-utils`, AlgoNode Algod & Indexer
- **UI:** Tailwind CSS v4, shadcn/ui, Radix UI, Geist, Lucide, `next-themes`, Recharts
- **Forms/validation:** React Hook Form, Zod
- **Analytics:** Vercel Analytics
- **Tooling:** pnpm, tsx

## Getting Started

```bash
# clone
git clone https://github.com/nickthelegend/0rca-explorer.git
cd 0rca-explorer

# install (repo uses legacy-peer-deps)
pnpm install

# run the dev server at http://localhost:3000
pnpm dev

# production build
pnpm build
pnpm start
```

The app defaults to public TestNet endpoints. To point at different nodes, set any of these environment variables (all optional):

```bash
NEXT_PUBLIC_ALGOD_URL      # default https://testnet-api.algonode.cloud
NEXT_PUBLIC_INDEXER_URL    # default https://testnet-idx.algonode.cloud
NEXT_PUBLIC_ALGOD_TOKEN
NEXT_PUBLIC_INDEXER_TOKEN
NEXT_PUBLIC_ALGOD_PORT
NEXT_PUBLIC_INDEXER_PORT
```

Inspect the raw chain data with a debug script:

```bash
npx tsx debug-algo.ts
```

## Project Structure

```
app/
  api/
    agents/route.ts            # list agents (+ count) from box storage
    agents/[id]/route.ts       # single agent: global state + task log
    transactions/route.ts      # logging-contract transactions via indexer
    network-configs/route.ts   # available network endpoints
  agents/                      # agent list + [id] detail pages
  transactions/                # transaction list page
  page.tsx                     # dashboard
  layout.tsx
components/                    # header, search, pagination, network-info + shadcn/ui
contexts/network-context.tsx  # TestNet/MainNet state + app IDs
lib/algorand.ts               # on-chain reads: agents, details, tasks, txns
hooks/                        # use-mobile, use-toast
debug-*.ts                    # standalone tsx inspection scripts
```

---

Built by [nickthelegend](https://github.com/nickthelegend) · [nickthelegend.tech](https://nickthelegend.tech)
