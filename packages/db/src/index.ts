import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

/**
 * Create a database connection using the Neon serverless driver.
 * This is optimized for serverless environments like Vercel Edge Functions.
 *
 * @param connectionString - The Neon database connection string.
 *                           Get this from your Vercel project environment variables.
 * @returns A Drizzle ORM database instance
 */
export function createDb(connectionString: string) {
    const sql = neon(connectionString);
    return drizzle(sql);
}

/**
 * Create a database connection using the DATABASE_URL environment variable.
 * Throws an error if DATABASE_URL is not set.
 *
 * @returns A Drizzle ORM database instance
 */
export function createDbFromEnv() {
    const connectionString = process.env.DATABASE_URL;

    if (!connectionString) {
        throw new Error('DATABASE_URL environment variable is not set');
    }

    return createDb(connectionString);
}

// Re-export drizzle-orm utilities that consumers might need
export { sql, eq, and, or, desc, asc, isNull, isNotNull } from 'drizzle-orm';
