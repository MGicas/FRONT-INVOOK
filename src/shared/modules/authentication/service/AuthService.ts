import type { LoginRequest, LoginResponse } from "../../../domain/Auth";
import apiService from "../../instances/AxiosInstance";

export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await apiService.post<LoginResponse>("/auth/login/", credentials);
    return response;
}