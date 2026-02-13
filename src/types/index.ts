// Tipi usati nell'app

export interface PostData {
    email: string;
    password: string;
}

export interface LoginResponse {
    token?: string;
    user?: {
        id?: string;
        email?: string;
        name?: string;
    };
    message?: string;
    error?: string;
}