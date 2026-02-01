import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '@/db/schema.js';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL!,
    idleTimeoutMillis: 30000,
});
export const db = drizzle(pool, { schema, casing: 'snake_case' });
