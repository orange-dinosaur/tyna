import { serve } from '@hono/node-server';
import { Hono } from 'hono';

const app = new Hono();

app.get('/', (c) => {
    return c.text('Welcome to tyna auth server!');
});

// Health check endpoint
app.get('/health', (c) => {
    return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const port = parseInt(process.env.AUTH_PORT || '3001');

serve(
    {
        fetch: app.fetch,
        port,
    },
    (info) => {
        console.log(`Auth server starting on http://localhost:${info.port}`);
    }
);
