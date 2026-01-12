export type LoginFormState = {
    status?: number;
    message?: string;
    email?: string;
    password?: string;
};

export type RegisterFormState = {
    status?: number;
    message?: string;
    username?: string;
    email?: string;
    password?: string;
};

export type LogoutFormState = {
    status?: number;
    message?: string;
};
