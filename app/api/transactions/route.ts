import { NextRequest, NextResponse } from 'next/server'
import { fetchAgentAccounts, fetchLoggingTransactions } from '@/lib/algorand'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const network = searchParams.get('network')
    const nextToken = searchParams.get('nextToken') || undefined

    if (network === 'mainnet') {
      return NextResponse.json({ transactions: [], nextToken: null })
    }

    const agents = await fetchAgentAccounts();
    const { transactions, nextToken: newNextToken } = await fetchLoggingTransactions(agents, nextToken);

    return NextResponse.json({
      transactions,
      nextToken: newNextToken
    })
  } catch (error) {
    console.error('Algorand fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch transactions' },
      { status: 500 }
    )
  }
}