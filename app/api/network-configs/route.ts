import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const networkConfigs = await prisma.networkConfig.findMany({
      orderBy: { id: 'asc' }
    })
    
    return NextResponse.json(networkConfigs)
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch network configs' },
      { status: 500 }
    )
  }
}