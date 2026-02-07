import { PrismaClient, Role, Status } from '@prisma/client';
import { hashPassword } from 'better-auth/crypto';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const userPassword = await hashPassword('demouser!1');
  const adminPassword = await hashPassword('demoadmin!1');

  const admin = await prisma.user.upsert({
    where: { email: 'admin@nextlaunchkit.com' },
    update: {
      emailVerified: true,
      status: Status.ACTIVE,
      role: Role.ADMIN,
    },
    create: {
      name: 'Demo Admin',
      first_name: 'Demo',
      last_name: 'Admin',
      email: 'admin@nextlaunchkit.com',
      emailVerified: true,
      role: Role.ADMIN,
      status: Status.ACTIVE,
    },
  });

  const user = await prisma.user.upsert({
    where: { email: 'user@nextlaunchkit.com' },
    update: {
      emailVerified: true,
      status: Status.ACTIVE,
    },
    create: {
      name: 'Demo User',
      first_name: 'Demo',
      last_name: 'User',
      email: 'user@nextlaunchkit.com',
      emailVerified: true,
      role: Role.USER,
      status: Status.ACTIVE,
    },
  });

  // Create better-auth credential accounts for each user
  for (const u of [
    { user: admin, password: adminPassword },
    { user: user, password: userPassword },
  ]) {
    // Delete existing credential account if any, then create fresh
    await prisma.account.deleteMany({
      where: { userId: u.user.id, providerId: 'credential' },
    });
    await prisma.account.create({
      data: {
        userId: u.user.id,
        providerId: 'credential',
        accountId: u.user.id.toString(),
        password: u.password,
      },
    });
  }

  console.log('Database seeded successfully!');
  console.log(`Created 2 users with credential accounts:`);
  console.log(
    `  - ${admin.first_name} ${admin.last_name} (${admin.email}) - ${admin.role}`
  );
  console.log(
    `  - ${user.first_name} ${user.last_name} (${user.email}) - ${user.role}`
  );

  console.log('\nLogin credentials:');
  console.log('Admin: admin@nextlaunchkit.com / demoadmin!1');
  console.log('User:  user@nextlaunchkit.com / demouser!1');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('Error seeding database:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
