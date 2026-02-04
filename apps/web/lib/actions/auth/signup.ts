'use server';

import { headers } from 'next/headers';
import { RegisterFormState } from '@/lib/types/auth';
import { signupSchema } from '@/lib/schemas/auth';
import { authClient } from '@/lib/auth-client';

export async function signup(
    inistialState: RegisterFormState,
    formData: FormData
): Promise<RegisterFormState> {
    const validatedFields = signupSchema.safeParse({
        username: formData.get('username'),
        email: formData.get('email'),
        password: formData.get('password'),
    });

    const returnState: RegisterFormState = {
        username: validatedFields.data?.username,
        email: validatedFields.data?.email,
        password: validatedFields.data?.password,
        status: 200,
        message: '',
    };

    if (!validatedFields.success) {
        const failedFields = [];

        const formattedErrors = validatedFields.error.format();
        if (formattedErrors.username?._errors) {
            failedFields.push(
                `username: ${formattedErrors.username._errors[0]}`
            );
        }
        if (formattedErrors.email?._errors)
            failedFields.push(`email: ${formattedErrors.email._errors[0]}`);
        if (formattedErrors.password?._errors)
            failedFields.push(
                `password: ${formattedErrors.password._errors[0]}`
            );

        // return directly the fields taken from the formData
        returnState.username = formData.get('username') as string;
        returnState.email = formData.get('email') as string;
        returnState.password = formData.get('password') as string;

        returnState.status = 400;
        returnState.message = failedFields.join(', ');
        return returnState;
    }

    try {
        const requestHeaders = await headers();
        const origin =
            requestHeaders.get('origin') ||
            requestHeaders.get('referer')?.split('/').slice(0, 3).join('/') ||
            process.env.NEXT_PUBLIC_AUTH_SERVER_BASE_URL;

        const signupResult = await authClient.signUp.email(
            {
                name: validatedFields.data?.username,
                email: validatedFields.data?.email,
                password: validatedFields.data?.password,
                image:
                    process.env.NEXT_PUBLIC_DEFAULT_USER_IMAGE_API +
                    validatedFields.data?.email,
                callbackURL:
                    process.env.NEXT_PUBLIC_VERIFICATION_EMAIL_CALLBACK_URL,
            },
            {
                headers: {
                    origin: origin!,
                },
            }
        );

        if (signupResult.error) {
            returnState.status = signupResult.error.status;
            returnState.message = signupResult.error.message;
            return returnState;
        }

        // if auth is successful clear fields
        returnState.username = '';
        returnState.email = '';
        returnState.password = '';
    } catch (error) {
        console.error(error);
        returnState.status = 500;
        returnState.message = 'Internal Server Error';
    }

    return returnState;
}
