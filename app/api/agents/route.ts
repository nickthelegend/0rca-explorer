import { NextRequest, NextResponse } from 'next/server'
import { fetchAgentAccounts, fetchNumberOfAgents } from '@/lib/algorand'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const network = searchParams.get('network')

    // Default to testnet if not specified or if mainnet (since user said mainnet config is missing)
    // But user said "Default App id for testnet : 749655317".
    // If network is mainnet, we might return empty or error, but let's just support testnet for now as per instructions.

    if (network === 'mainnet') {
      return NextResponse.json({ count: 0, agents: [] })
    }

    const [count, agentAddresses] = await Promise.all([
      fetchNumberOfAgents(),
      fetchAgentAccounts()
    ]);

    const agents = agentAddresses.map(address => ({
      id: address,
      name: `Agent ${address.slice(0, 6)}...${address.slice(-4)}`,
      creatorName: "Algorand",
      description: "Autonomous Agent on Algorand Testnet",
      createdAt: new Date().toISOString(), // We don't have this info easily without more queries
      status: "active"
    }));

    return NextResponse.json({
      count: count,
      agents: agents
    })
  } catch (error) {
    console.error('Algorand fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch agents' },
      { status: 500 }
    )
  }
}