import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

async function globalSetup() {
    const prisma = new PrismaClient({
        datasources: {
            db: {
                url: "postgresql://postgres:password123@localhost:5433/next_launch_kit_test"
            }
        }
    });
    
    try {
        // Clear existing users
        await prisma.user.deleteMany();
        
        // Create admin user
        const adminPassword = await bcrypt.hash('demoadmin!1', 10);
        await prisma.user.create({
            data: {
                first_name: "Admin",
                last_name: "User",
                email: "admin@nextlaunchkit.com",
                password: adminPassword,
                role: "ADMIN",
                status: "ACTIVE",
            }
        });

        // Create regular user
        const userPassword = await bcrypt.hash('demouser!1', 10);
        await prisma.user.create({
            data: {
                first_name: "Demo",
                last_name: "User",
                email: "user@nextlaunchkit.com",
                password: userPassword,
                role: "USER",
                status: "ACTIVE",
            }
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
