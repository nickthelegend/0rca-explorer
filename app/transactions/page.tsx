"use client"

import { SearchBar } from "@/components/search-bar"
import { Pagination } from "@/components/pagination"
import { Button } from "@/components/ui/button"
import { Copy, ExternalLink, LayoutGrid, List } from "lucide-react"
import { useState, useMemo } from "react"
import { useSearchParams } from "next/navigation"

const allTransactions = [
  {
    id: "345cb4e6419f96e26d330b9920eb93f0b8669e3c7fe5796e90423e2fafe8c0d8",
    type: "blockchain_tx",
    date: "Oct 12, 2025, 8:59 AM",
    agent: "Price Oracle Agent",
  },
  {
    id: "a73886df130077d1da61630d5cfbf4b2f1e01314969681688bfba6ab006cb625",
    type: "blockchain_tx",
    date: "Oct 12, 2025, 8:13 AM",
    agent: "Liquidity Monitor",
  },
  {
    id: "09fcbe5e6e917dd2009c197bd9dbe07410634185b94590aaa5284d6b94448f",
    type: "blockchain_tx",
    date: "Oct 12, 2025, 8:03 AM",
    agent: "Automated Swap Agent",
  },
  {
    id: "b4486aF16c805479d7043d2a7509eadfd60fe987c24739861e5337525a5f",
    type: "blockchain_tx",
    date: "Oct 12, 2025, 7:45 AM",
    agent: "Analytics Reporter",
  },
  {
    id: "5ce33da4ef37aef230d9ffb60adf1e268cf79130899d2089abeab09b3f289d5d",
    type: "blockchain_tx",
    date: "Oct 12, 2025, 4:07 AM",
    agent: "NFT Tracker",
  },
  {
    id: "7e98eb2b7639509f317c2732d1405e0712cb275a575dceb4b5a97316e8fdd8ee",
    type: "blockchain_tx",
    date: "Oct 12, 2025, 4:06 AM",
    agent: "Governance Agent",
  },
  {
    id: "bef0e0f2c48bb0f39002f8d6e80fa76d897bdd95ceb77574a0717c2408baec1",
    type: "blockchain_tx",
    date: "Oct 12, 2025, 4:06 AM",
    agent: "Yield Optimizer",
  },
  {
    id: "2bee1b19dfff4e85c0c9062e853cea08346be90d221d82e71931f1ae0c30179a",
    type: "blockchain_tx",
    date: "Oct 12, 2025, 3:00 AM",
    agent: "Security Monitor",
  },
  {
    id: "8a9b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b",
    type: "blockchain_tx",
    date: "Oct 12, 2025, 2:45 AM",
    agent: "Market Maker Bot",
  },
  {
    id: "1f2e3d4c5b6a7980e9d8c7b6a5948372615049382716059483726150493827",
    type: "blockchain_tx",
    date: "Oct 12, 2025, 1:30 AM",
    agent: "Arbitrage Scanner",
  },
  {
    id: "9e8d7c6b5a4938271605948372615049382716059483726150493827160594",
    type: "blockchain_tx",
    date: "Oct 12, 2025, 12:15 AM",
    agent: "Price Oracle Agent",
  },
  {
    id: "7f6e5d4c3b2a1908e7d6c5b4a3928170615049382716059483726150493827",
    type: "blockchain_tx",
    date: "Oct 11, 2025, 11:50 PM",
    agent: "Liquidity Monitor",
  },
]

const ITEMS_PER_PAGE = 10

export default function TransactionsPage() {
  const [view, setView] = useState<"list" | "tiles">("list")
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const searchParams = useSearchParams()
  const currentPage = Number.parseInt(searchParams.get("page") || "1")
  const searchQuery = searchParams.get("search") || ""

  const filteredTransactions = useMemo(() => {
    if (!searchQuery) return allTransactions
    const query = searchQuery.toLowerCase()
    return allTransactions.filter((tx) => tx.id.toLowerCase().includes(query) || tx.agent.toLowerCase().includes(query))
  }, [searchQuery])

  const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const paginatedTransactions = filteredTransactions.slice(startIndex, endIndex)

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(text)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <main className="min-h-screen">
      <SearchBar />

      <div className="container mx-auto px-6 pb-16">
        <div className="mb-8">
          <div className="flex items-end justify-between mb-3">
            <div>
              <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                Transactions
              </h1>
              <p className="text-zinc-400 text-lg">
                Track all agent transactions on Algorand blockchain
                {searchQuery && (
                  <span className="ml-2 text-zinc-500">
                    ({filteredTransactions.length} result{filteredTransactions.length !== 1 ? "s" : ""})
                  </span>
                )}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setView("list")}
                className={`h-10 w-10 rounded-lg ${
                  view === "list" ? "bg-white/10 text-white" : "text-zinc-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <List className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setView("tiles")}
                className={`h-10 w-10 rounded-lg ${
                  view === "tiles" ? "bg-white/10 text-white" : "text-zinc-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <LayoutGrid className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {paginatedTransactions.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-zinc-500 text-lg">No transactions found matching your search.</p>
          </div>
        ) : view === "list" ? (
          <div className="rounded-2xl bg-zinc-900/50 border border-white/10 overflow-hidden">
            <div className="border-b border-white/10">
              <h2 className="text-2xl font-bold p-6 text-white">Recent Transactions</h2>
            </div>

            <div className="grid grid-cols-[1fr_auto_auto] gap-4 px-6 py-4 border-b border-white/10 text-sm font-medium text-zinc-400">
              <div>Transaction ID</div>
              <div className="w-40">Type</div>
              <div className="w-48 text-right">Date</div>
            </div>

            <div className="divide-y divide-white/5">
              {paginatedTransactions.map((tx) => (
                <div
                  key={tx.id}
                  className="grid grid-cols-[1fr_auto_auto] gap-4 px-6 py-3 hover:bg-white/5 transition-colors group"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <a
                      href={`https://testnet.algoexplorer.io/tx/${tx.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-sm text-blue-400 hover:text-blue-300 truncate"
                    >
                      {tx.id}
                    </a>
                    <button
                      onClick={() => copyToClipboard(tx.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                      title="Copy transaction ID"
                    >
                      {copiedId === tx.id ? (
                        <span className="text-xs text-emerald-400">✓</span>
                      ) : (
                        <Copy className="h-4 w-4 text-zinc-500 hover:text-white" />
                      )}
                    </button>
                    <a
                      href={`https://testnet.algoexplorer.io/tx/${tx.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                      title="View on AlgoExplorer"
                    >
                      <ExternalLink className="h-4 w-4 text-zinc-500 hover:text-white" />
                    </a>
                  </div>
                  <div className="w-40 flex items-center">
                    <span className="text-sm text-zinc-300">{tx.type}</span>
                  </div>
                  <div className="w-48 flex items-center justify-end">
                    <span className="text-sm text-zinc-400">{tx.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {paginatedTransactions.map((tx) => (
              <div
                key={tx.id}
                className="p-6 rounded-2xl bg-zinc-900/50 border border-white/10 hover:border-white/20 hover:bg-zinc-900/70 transition-all group"
              >
                <div className="mb-4">
                  <div className="text-xs text-zinc-500 mb-2">Transaction ID</div>
                  <div className="flex items-center gap-2">
                    <a
                      href={`https://testnet.algoexplorer.io/tx/${tx.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-sm text-blue-400 hover:text-blue-300 truncate"
                    >
                      {tx.id.slice(0, 16)}...
                    </a>
                    <button
                      onClick={() => copyToClipboard(tx.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                    >
                      {copiedId === tx.id ? (
                        <span className="text-xs text-emerald-400">✓</span>
                      ) : (
                        <Copy className="h-4 w-4 text-zinc-500 hover:text-white" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="text-xs text-zinc-500 mb-1">Type</div>
                    <div className="text-sm text-zinc-300">{tx.type}</div>
                  </div>
                  <div>
                    <div className="text-xs text-zinc-500 mb-1">Agent</div>
                    <div className="text-sm text-zinc-300">{tx.agent}</div>
                  </div>
                  <div>
                    <div className="text-xs text-zinc-500 mb-1">Date</div>
                    <div className="text-sm text-zinc-400">{tx.date}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} />}
      </div>
    </main>
  )
}
