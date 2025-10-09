import { axiosInstance } from "../../../../shared/modules/instances/AxiosInstance";


export const getConsum = async (id: string) => {
    const response = await axiosInstance.get(`/consum/${id}`); 
    return response.data;
};