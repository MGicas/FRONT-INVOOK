import axios from "axios";
import type { AxiosInstance, AxiosResponse, AxiosRequestConfig } from "axios";
import { BASE_URL } from "../../service/Endpoints";

const axiosInstance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    const errorToThrow =
      error instanceof Error ? error : new Error("Request error");
    return Promise.reject(errorToThrow);
  }
);

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = sessionStorage.getItem("refresh_token");
        if (refreshToken) {
          const refreshResponse = await axios.post(`${BASE_URL}auth/refresh/`, {
            refresh: refreshToken,
          });

          const newAccessToken = refreshResponse.data.access;
          sessionStorage.setItem("access_token", newAccessToken);

          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return axiosInstance(originalRequest);
        }
      } catch (error) {
        sessionStorage.removeItem("access_token");
        sessionStorage.removeItem("refresh_token");
        window.location.href = "/login";
        return Promise.reject(new Error("Session expired", { cause: error }));
      }
    }

    const errorToReject =
      error instanceof Error ? error : new Error("Response error");
    return Promise.reject(errorToReject);
  }
);

class ApiService {
  async get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await axiosInstance.get(url, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async post<T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      const response: AxiosResponse<T> = await axiosInstance.post(
        url,
        data,
        config
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async put<T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      const response: AxiosResponse<T> = await axiosInstance.put(
        url,
        data,
        config
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async delete<T = unknown>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      const response: AxiosResponse<T> = await axiosInstance.delete(
        url,
        config
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async patch<T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      const response: AxiosResponse<T> = await axiosInstance.patch(
        url,
        data,
        config
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: unknown): Error {
    if (error && typeof error === "object" && "response" in error) {
      const axiosError = error as {
        response: {
          status: number;
          data?: { message?: string; detail?: string };
        };
      };
      const message =
        axiosError.response.data?.message ||
        axiosError.response.data?.detail ||
        "Error del servidor";
      return new Error(`${axiosError.response.status}: ${message}`);
    } else if (error && typeof error === "object" && "request" in error) {
      return new Error("No se pudo conectar con el servidor");
    } else {
      return new Error("Error en la configuración de la petición");
    }
  }
}

const apiService = new ApiService();

export default apiService;
export { axiosInstance };

export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  status: number;
}

export interface PaginatedResponse<T = unknown> {
  results: T[];
  count: number;
  next: string | null;
  previous: string | null;
}
