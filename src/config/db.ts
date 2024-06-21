import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

declare global {
    var prisma: PrismaClient | undefined;
}

const connectionString = `${process.env.DATABASE_URL}`;

export const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const PrismaSingleton = (function () {
    let instance: PrismaClient | undefined;
    function createPrismaInstance() {
        return new PrismaClient({ adapter });
    }

    return {
        getInstance: function () {
            if (!instance) instance = createPrismaInstance();
            return instance;
        }
    };
})();

globalThis.prisma = PrismaSingleton.getInstance();

export const db = globalThis.prisma;

// class PrismaSingleton {
//     private static instance: PrismaSingleton
//     constructor() {
//         if (!PrismaSingleton.instance)
//             PrismaSingleton.instance = new PrismaClient({ adapter })
//         return PrismaSingleton.instance
//     }
// }
