import type { User } from "../domain/Auth";


const ACCESS_KEY_TOKEN = "access_token";
const REFRESH_KEY_TOKEN = "refresh_token";
const USER_KEY = "user";

export const setAuth = (access: string, refresh: string, user: User) => {
    sessionStorage.setItem(ACCESS_KEY_TOKEN, access);
    sessionStorage.setItem(REFRESH_KEY_TOKEN, refresh);
    sessionStorage.setItem(USER_KEY, JSON.stringify(user));
}

export const getAccessToken = (): string | null => {
    return sessionStorage.getItem(ACCESS_KEY_TOKEN);
}

export const getUser = (): User | null => {
    const user = sessionStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
}

export const clearAuth = () => {
    sessionStorage.removeItem(ACCESS_KEY_TOKEN);
    sessionStorage.removeItem(REFRESH_KEY_TOKEN);
    sessionStorage.removeItem(USER_KEY);
}