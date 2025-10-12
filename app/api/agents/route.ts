import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const network = searchParams.get('network')

    if (!network || (network !== 'testnet' && network !== 'mainnet')) {
      return NextResponse.json(
        { error: 'Network parameter is required and must be either "testnet" or "mainnet"' },
        { status: 400 }
      )
    }

    let agents
    if (network === 'testnet') {
      agents = await prisma.agentTestnet.findMany({
        orderBy: { createdAt: 'desc' }
      })
    } else {
      agents = await prisma.agentMainnet.findMany({
        orderBy: { createdAt: 'desc' }
      })
    }

    return NextResponse.json(agents)
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch agents' },
      { status: 500 }
    )
  }
}