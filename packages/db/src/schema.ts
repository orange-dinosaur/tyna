import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

/**
 * Example users table.
 * Replace or extend this with your actual schema definitions.
 */
export const users = pgTable('users', {
    id: uuid('id').primaryKey().defaultRandom(),
    email: text('email').notNull().unique(),
    name: text('name'),
    createdAt: timestamp('created_at', { withTimezone: true })
        .notNull()
        .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
        .notNull()
        .defaultNow(),
});

// Add more table definitions here as needed
// export const posts = pgTable("posts", { ... });
