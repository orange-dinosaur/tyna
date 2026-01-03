import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { auth } from '@/lib/auth.js';

const app = new Hono();

// Health check endpoint
app.get('/health', (c) => {
    return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.on(['POST', 'GET'], '/api/auth/*', (c) => auth.handler(c.req.raw));

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
