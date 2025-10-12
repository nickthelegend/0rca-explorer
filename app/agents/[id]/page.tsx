import { SearchBar } from "@/components/search-bar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, Copy, Globe, User, Activity, Zap, CheckCircle2 } from "lucide-react"
import Link from "next/link"

export default function AgentDetailPage({ params }: { params: { id: string } }) {
  return (
    <main className="min-h-screen">
      <SearchBar />

      <div className="container mx-auto px-6 pb-16">
        <Link
          href="/agents"
          className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Agents
        </Link>

        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
              Price Oracle Agent
            </h1>
            <p className="text-zinc-400 text-lg">Fetches and updates real-time price data from multiple DEXs</p>
          </div>
          <Badge
            variant="outline"
            className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-sm px-4 py-2"
          >
            Active
          </Badge>
        </div>

        <div className="grid gap-6 mb-8 md:grid-cols-4">
          <Card className="bg-zinc-900/50 border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <Activity className="h-5 w-5 text-blue-400" />
                <span className="text-sm text-zinc-400">Total Transactions</span>
              </div>
              <div className="text-3xl font-bold">1,247</div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900/50 border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <Zap className="h-5 w-5 text-amber-400" />
                <span className="text-sm text-zinc-400">Avg Response</span>
              </div>
              <div className="text-3xl font-bold">1.2s</div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900/50 border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                <span className="text-sm text-zinc-400">Success Rate</span>
              </div>
              <div className="text-3xl font-bold">99.8%</div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900/50 border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <Globe className="h-5 w-5 text-purple-400" />
                <span className="text-sm text-zinc-400">Network</span>
              </div>
              <div className="text-xl font-bold">TestNet</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
          <div className="space-y-6">
            <Card className="bg-zinc-900/50 border-white/10">
              <CardHeader>
                <CardTitle className="text-xl">Agent Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-10 w-10 rounded-lg bg-white/5 flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <div className="text-sm text-zinc-500 mb-1">Created</div>
                        <div className="font-medium">October 9, 2025</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-10 w-10 rounded-lg bg-white/5 flex items-center justify-center">
                        <User className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <div className="text-sm text-zinc-500 mb-1">Creator</div>
                        <div className="font-medium">ORCA Team</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/5">
                  <div className="flex items-start gap-3">
                    <Copy className="h-5 w-5 text-zinc-400 mt-1" />
                    <div className="flex-1">
                      <div className="text-sm text-zinc-500 mb-2">Application ID</div>
                      <div className="font-mono text-sm bg-black/20 p-3 rounded-lg border border-white/5 break-all">
                        1234567890
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/5">
                  <div className="flex items-start gap-3">
                    <Copy className="h-5 w-5 text-zinc-400 mt-1" />
                    <div className="flex-1">
                      <div className="text-sm text-zinc-500 mb-2">Asset ID</div>
                      <div className="font-mono text-sm bg-black/20 p-3 rounded-lg border border-white/5 break-all">
                        9876543210
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900/50 border-white/10">
              <CardHeader>
                <CardTitle className="text-xl">Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-zinc-300 leading-relaxed">
                  This autonomous agent monitors and fetches real-time price data from multiple decentralized exchanges
                  on the Algorand blockchain. It aggregates pricing information, calculates weighted averages, and
                  updates on-chain oracles to ensure accurate market data for DeFi applications.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900/50 border-white/10">
              <CardHeader>
                <CardTitle className="text-xl">Metadata</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-xs font-mono bg-black/40 p-6 rounded-lg overflow-x-auto border border-white/5 text-zinc-300">
                  {`{
  "appId": "1234567890",
  "assetId": "9876543210",
  "network": "TestNet",
  "version": "2.1.0",
  "capabilities": [
    "price_oracle",
    "dex_aggregation",
    "automated_updates"
  ],
  "updateFrequency": "30s",
  "supportedDEXs": [
    "Tinyman",
    "Pact",
    "Humble"
  ],
  "creationTxn": "ALGO7X4K2M9P3Q8R5T6Y..."
}`}
                </pre>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="bg-zinc-900/50 border-white/10">
              <CardHeader>
                <CardTitle className="text-xl">Capabilities</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Badge
                  variant="outline"
                  className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-sm px-3 py-1.5"
                >
                  Price Oracle
                </Badge>
                <Badge
                  variant="outline"
                  className="bg-purple-500/10 text-purple-400 border-purple-500/20 text-sm px-3 py-1.5"
                >
                  DEX Aggregation
                </Badge>
                <Badge
                  variant="outline"
                  className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-sm px-3 py-1.5"
                >
                  Automated Updates
                </Badge>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900/50 border-white/10">
              <CardHeader>
                <CardTitle className="text-xl">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-black/20 border border-white/5">
                  <div className="h-2 w-2 rounded-full bg-emerald-400 mt-2" />
                  <div className="flex-1">
                    <div className="text-sm font-medium mb-1">Price Update</div>
                    <div className="text-xs text-zinc-500">2 minutes ago</div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-black/20 border border-white/5">
                  <div className="h-2 w-2 rounded-full bg-emerald-400 mt-2" />
                  <div className="flex-1">
                    <div className="text-sm font-medium mb-1">DEX Query</div>
                    <div className="text-xs text-zinc-500">5 minutes ago</div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-black/20 border border-white/5">
                  <div className="h-2 w-2 rounded-full bg-emerald-400 mt-2" />
                  <div className="flex-1">
                    <div className="text-sm font-medium mb-1">Oracle Update</div>
                    <div className="text-xs text-zinc-500">8 minutes ago</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900/50 border-white/10">
              <CardHeader>
                <CardTitle className="text-xl">Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-sm text-zinc-500 mb-2">Update Frequency</div>
                  <div className="font-medium">30 seconds</div>
                </div>
                <div>
                  <div className="text-sm text-zinc-500 mb-2">Supported DEXs</div>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-sm px-2 py-1 rounded bg-white/5 border border-white/5">Tinyman</span>
                    <span className="text-sm px-2 py-1 rounded bg-white/5 border border-white/5">Pact</span>
                    <span className="text-sm px-2 py-1 rounded bg-white/5 border border-white/5">Humble</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
