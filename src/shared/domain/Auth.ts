export interface LoginRequest {
    username: string;
    password: string;
}

export interface User { 
    id: string;
    username: string;
    role: string;
    state: string;
}

export interface LoginResponse {
    access: string;
    refresh: string;
    user: User;
}