import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const algorandTxTypes = ['appl', 'axfer', 'acfg', 'pay', 'keyreg', 'afrz']

function generateTxId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
  let result = ''
  for (let i = 0; i < 52; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

async function main() {
  // Create network configs
  await prisma.networkConfig.createMany({
    data: [
      { name: 'testnet', smartContractAppID: '1234567890' },
      { name: 'mainnet', smartContractAppID: '0987654321' }
    ],
    skipDuplicates: true
  })

  // Create testnet agents
  await prisma.agentTestnet.createMany({
    data: [
      {
        name: 'Test_Agent_01',
        description: 'Price oracle agent for testnet',
        creatorName: 'ORCA Team',
        metadata: {}
      },
      {
        name: 'Test_Agent_02',
        description: 'Liquidity monitoring agent',
        creatorName: 'DeFi Labs',
        metadata: {}
      },
      {
        name: 'Test_Agent_03',
        description: 'Automated swap agent',
        creatorName: 'Trading Bot Inc',
        metadata: {}
      }
    ],
    skipDuplicates: true
  })

  // Create mainnet agents
  await prisma.agentMainnet.createMany({
    data: [
      {
        name: 'Main_Agent_01',
        description: 'Production price oracle',
        creatorName: 'ORCA Team',
        metadata: {}
      },
      {
        name: 'Main_Agent_02',
        description: 'Production liquidity monitor',
        creatorName: 'DeFi Labs',
        metadata: {}
      }
    ],
    skipDuplicates: true
  })

  // Create testnet transactions
  const testnetTxs = Array.from({ length: 10 }, () => ({
    transactionId: generateTxId(),
    transactionType: algorandTxTypes[Math.floor(Math.random() * algorandTxTypes.length)],
    network: 'testnet'
  }))

  await prisma.transactionTestnet.createMany({
    data: testnetTxs,
    skipDuplicates: true
  })

  // Create mainnet transactions
  const mainnetTxs = Array.from({ length: 10 }, () => ({
    transactionId: generateTxId(),
    transactionType: algorandTxTypes[Math.floor(Math.random() * algorandTxTypes.length)],
    network: 'mainnet'
  }))

  await prisma.transactionMainnet.createMany({
    data: mainnetTxs,
    skipDuplicates: true
  })

  console.log('Database seeded successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })