import { axiosInstance } from "../../../../shared/modules/instances/AxiosInstance";
import type { Loan } from "../../model/Loan";

export const getLoans = async (): Promise<Loan[]> => {
  try {
    const response = await axiosInstance.get<Loan[]>('/loan/');
    return response.data;
  } catch (error) {
    console.error('Error fetching loans:', error);
    throw new Error('Error al obtener los préstamos');
  }
};