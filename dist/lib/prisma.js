import 'dotenv/config';
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client.js';
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
    throw new Error('DATABASE_URL is missing in .env file');
}
// Update the Pool configuration here
const pool = new pg.Pool({
    connectionString,
    // This explicitly tells pg to use the current behavior 
    // and satisfies the "verify-full" requirement mentioned in the warning.
    ssl: {
        rejectUnauthorized: true
    }
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
export { prisma };
