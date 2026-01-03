import { Resend } from 'resend';

type EmailParams = {
    to: string;
    subject: string;
    text: string;
};

export const sendEmail = async ({ to, subject, text }: EmailParams) => {
    const resend = new Resend(process.env.EMAIL_API_KEY);
    const domain = process.env.EMAIL_DOMAIN;

    try {
        await resend.emails.send({
            from: `Tyna - Email Verification <email-verification@${domain}>`,
            to,
            subject,
            text,
        });
    } catch (error) {
        console.error('Error sending email:', error);
    }
};
