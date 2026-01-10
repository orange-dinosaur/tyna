'use client';

import { LoginFormState } from '@/lib/types/auth';
import { loginSchema } from '@/lib/schemas/auth';
import { authClient } from '@/lib/auth-client';

export async function login(
    email: string,
    password: string
): Promise<LoginFormState> {
    const validatedFields = loginSchema.safeParse({
        email,
        password,
    });

    const returnState: LoginFormState = {
        email,
        password,
        status: 200,
        message: '',
    };

    if (!validatedFields.success) {
        const failedFields = [];

        const formattedErrors = validatedFields.error.format();
        if (formattedErrors.email?._errors)
            failedFields.push(`email: ${formattedErrors.email._errors[0]}`);
        if (formattedErrors.password?._errors)
            failedFields.push(
                `password: ${formattedErrors.password._errors[0]}`
            );

        // return directly the fields taken from the formData
        returnState.email = email;
        returnState.password = password;

        returnState.status = 400;
        returnState.message = failedFields.join(', ');
        return returnState;
    }

    try {
        const loginResult = await authClient.signIn.email({
            email: validatedFields.data?.email,
            password: validatedFields.data?.password,
            rememberMe: true,
        });

        if (loginResult.error) {
            returnState.status = loginResult.error.status;
            returnState.message = loginResult.error.message;
            return returnState;
        }
    } catch (error) {
        console.error(error);
        returnState.status = 500;
        returnState.message = 'Internal Server Error';
    }

    return returnState;
}
