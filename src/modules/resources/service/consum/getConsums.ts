import { axiosInstance } from "../../../../shared/modules/instances/AxiosInstance";
import type { Consum } from "../../model/Consum";

export const getConsums = async (): Promise<Consum[]> => {
    const response = await axiosInstance.get("/consum"); 
    return response.data;
};