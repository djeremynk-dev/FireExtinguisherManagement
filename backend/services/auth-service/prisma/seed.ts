import 'dotenv/config';
import { prisma } from '../src/lib/prisma.js';
import bcrypt from 'bcryptjs';
import { UserRole } from '../generated/prisma/enums.ts';

async function main() {
    const exists = await prisma.user.findUnique({ where: { email: 'admin@tzw.com' } });
    if (!exists) {
        await prisma.user.create({
            data: {
                firstName: 'Admin',
                lastName: 'User',
                email: 'admin@tzw.com',
                passwordHash: await bcrypt.hash('Admin12345', 12),
                role: UserRole.ADMIN,
                isActive: true,
                isEmailVerified: true
            }
        });
    }
}

main()
    .then(async () => prisma.$disconnect())
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });