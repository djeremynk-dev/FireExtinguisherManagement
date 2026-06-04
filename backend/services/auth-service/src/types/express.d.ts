import type { UserRole } from '../../generated/prisma/enums.ts';

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                email: string;
                role: UserRole;
            };
        }
    }
}

export {};