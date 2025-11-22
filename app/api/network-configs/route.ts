import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json([
    {
      id: 'testnet',
      name: 'Testnet',
      algodUrl: 'https://testnet-api.algonode.cloud',
      indexerUrl: 'https://testnet-idx.algonode.cloud',
      explorerUrl: 'https://testnet.algoexplorer.io'
    }
  ])
}