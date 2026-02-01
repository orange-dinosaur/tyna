import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '@/db/db.js';
import { openAPI } from 'better-auth/plugins';
import { sendEmail } from '@/lib/email.js';

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: 'pg',
    }),

    emailAndPassword: {
        enabled: true,
        requireEmailVerification: true,
    },
    emailVerification: {
        sendOnSignUp: true,
        sendVerificationEmail: async ({ user, url, token }, request) => {
            void sendEmail({
                to: user.email,
                subject: 'Verify your email address',
                text: `Click the link to verify your email: ${url}`,
            });
        },
    },

    plugins: [openAPI()],

    trustedOrigins: [process.env.WEB_APP_URL!],
});
