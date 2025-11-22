import { NextRequest, NextResponse } from 'next/server'
import { fetchAgents, fetchNumberOfAgents } from '@/lib/algorand'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const network = searchParams.get('network')

    if (network === 'mainnet') {
      return NextResponse.json({ count: 0, agents: [] })
    }

    // Fetch agents directly from boxes
    const agents = await fetchAgents();
    const count = await fetchNumberOfAgents(); // Keep this for verification/stats

    return NextResponse.json({
      count: count > 0 ? count : agents.length,
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