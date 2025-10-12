import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create network configs
  await prisma.networkConfig.createMany({
    data: [
      {
        name: 'testnet',
        smartContractAppID: '1234567890'
      },
      {
        name: 'mainnet',
        smartContractAppID: '0987654321'
      }
    ],
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