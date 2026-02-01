'use client';

import { LogoutFormState } from '@/lib/types/auth';
import { authClient } from '@/lib/auth-client';

export async function logout(): Promise<LogoutFormState> {
    const returnState: LogoutFormState = {
        status: 200,
        message: '',
    };

    try {
        const logoutResult = await authClient.signOut();

        if (logoutResult.error) {
            returnState.status = logoutResult.error.status;
            returnState.message = logoutResult.error.message;
            return returnState;
        }
    } catch (error) {
        console.error(error);
        returnState.status = 500;
        returnState.message = 'Internal Server Error';
    }

    return returnState;
}
