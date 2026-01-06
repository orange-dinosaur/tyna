'use server';

import { LoginFormState } from '@/lib/types/auth';
import { loginSchema } from '@/lib/schemas/auth';

export async function login(
    inistialState: LoginFormState,
    formData: FormData
): Promise<LoginFormState> {
    const validatedFields = loginSchema.safeParse({
        email: formData.get('email'),
        password: formData.get('password'),
    });

    const returnState: LoginFormState = {
        email: validatedFields.data?.email,
        password: validatedFields.data?.password,
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
        returnState.email = formData.get('email') as string;
        returnState.password = formData.get('password') as string;

        returnState.status = 400;
        returnState.message = failedFields.join(', ');
        return returnState;
    }

    try {
        console.log('returnState', returnState);
    } catch (error) {
        console.error(error);
        returnState.status = 500;
        returnState.message = 'Internal Server Error';
    }

    return returnState;
}
