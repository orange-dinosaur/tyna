import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema.js';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL!,
    idleTimeoutMillis: 30000,
});
const db = drizzle({ client: pool, schema, casing: 'snake_case' });

export default db;
