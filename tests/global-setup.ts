import { PrismaClient } from '@prisma/client';
import { hashPassword } from 'better-auth/crypto';

async function globalSetup() {
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: 'postgresql://postgres:password123@localhost:5433/next_launch_kit_test',
      },
    },
  });

  try {
    // Clear existing data
    await prisma.account.deleteMany();
    await prisma.session.deleteMany();
    await prisma.user.deleteMany();

    // Create admin user
    const adminPassword = await hashPassword('demoadmin!1');
    const admin = await prisma.user.create({
      data: {
        name: 'Admin User',
        first_name: 'Admin',
        last_name: 'User',
        email: 'admin@nextlaunchkit.com',
        emailVerified: true,
        role: 'ADMIN',
        status: 'ACTIVE',
      },
    });

    await prisma.account.create({
      data: {
        userId: admin.id,
        providerId: 'credential',
        accountId: admin.id.toString(),
        password: adminPassword,
      },
    });

    // Create regular user
    const userPassword = await hashPassword('demouser!1');
    const user = await prisma.user.create({
      data: {
        name: 'Demo User',
        first_name: 'Demo',
        last_name: 'User',
        email: 'user@nextlaunchkit.com',
        emailVerified: true,
        role: 'USER',
        status: 'ACTIVE',
      },
    });

    await prisma.account.create({
      data: {
        userId: user.id,
        providerId: 'credential',
        accountId: user.id.toString(),
        password: userPassword,
      },
    });

    console.log('✅ Test users created successfully');
  } catch (error) {
    console.error('❌ Error creating test users:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

export default globalSetup;
