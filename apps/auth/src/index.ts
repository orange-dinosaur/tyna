import 'dotenv/config';
import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { auth } from '@/lib/auth.js';

const app = new Hono();

app.use(
    '/api/auth/*',
    cors({
        origin: process.env.WEB_APP_URL!,
        credentials: true,
        allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowHeaders: ['Content-Type', 'Authorization'],
    })
);

app.get('/', (c) => {
    return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/health', (c) => {
    return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.on(['POST', 'GET'], '/api/auth/*', (c) => auth.handler(c.req.raw));

const port = parseInt(process.env.AUTH_PORT!);
serve(
    {
        fetch: app.fetch,
        port,
    },
    (info) => {
        console.log(`Auth server is running...`);
    }
);
