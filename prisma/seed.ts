import { PrismaClient, Role } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  const userPassword = await bcrypt.hash('demouser!1', 12)
  const adminPassword = await bcrypt.hash('demoadmin!1', 12)

  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: 'admin@nextlaunchkit.com' },
      update: {},
      create: {
        first_name: 'Demo',
        last_name: 'Admin',
        email: 'admin@nextlaunchkit.com',
        password: adminPassword,
        role: Role.ADMIN,
      },
    }),
    prisma.user.upsert({
      where: { email: 'user@nextlaunchkit.com' },
      update: {},
      create: {
        first_name: 'Demo',
        last_name: 'User',
        email: 'user@nextlaunchkit.com',
        password: userPassword,
        role: Role.USER,
      },
    }),
  ])

  console.log('Database seeded successfully!')
  console.log(`Created ${users.length} users:`)
  users.forEach((user) => {
    console.log(`  - ${user.first_name} ${user.last_name} (${user.email}) - ${user.role}`)
  })
  
  console.log('\nLogin credentials:')
  console.log('Admin: admin@nextlaunchkit.com / demoadmin!1')
  console.log('User:  user@nextlaunchkit.com / demouser!1')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('Error seeding database:', e)
    await prisma.$disconnect()
    process.exit(1)
  })