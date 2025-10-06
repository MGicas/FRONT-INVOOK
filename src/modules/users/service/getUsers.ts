import apiService from "../../../shared/modules/instances/AxiosInstance";
import type { User } from "../model/UserTypes";

export const getUsers = async (): Promise<User[]> => {
  try {
    const response = await apiService.get<User[]>("users/");
    return response;
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    throw error;
  }
};

export const searchUsers = async (searchTerm: string): Promise<User[]> => {
  if (!searchTerm.trim()) {
    return getUsers();
  }

  try {
    const response = await apiService.get<User[]>(
      `users/?names=${encodeURIComponent(searchTerm)}`
    );
    return response;
  } catch (error) {
    console.error("Error al buscar usuarios:", error);
    throw error;
  }
};

export const getUserById = async (id: string): Promise<User> => {
  try {
    const response = await apiService.get<User>(`users/${id}/`);
    return response;
  } catch (error) {
    console.error("Error al obtener usuario:", error);
    throw error;
  }
};

export default {
  getAll: getUsers,
  search: searchUsers,
  getById: getUserById,
};