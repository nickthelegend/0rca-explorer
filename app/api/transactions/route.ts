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

    let transactions
    if (network === 'testnet') {
      transactions = await prisma.transactionTestnet.findMany({
        orderBy: { timestamp: 'desc' }
      })
    } else {
      transactions = await prisma.transactionMainnet.findMany({
        orderBy: { timestamp: 'desc' }
      })
    }

    return NextResponse.json(transactions)
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch transactions' },
      { status: 500 }
    )
  }
}