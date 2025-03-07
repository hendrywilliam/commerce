export type User = {
    email: string;
    fullname: string;
    image_url: string;
    private_metadata: Record<string, any>;
    created_at: number;
};

export type EmailLoginCredentials = {
    email: string;
    password: string;
};

export type EmailRegistrationCredentials = {
    email: string;
    password: string;
    confirm_password: string;
    fullname: string;
    authentication_type: "GOOGLE" | "REGISTRATION";
};

export type EmailRegistrationResponse = {
    Data: User | null;
    Message: string;
    Code: number;
};
