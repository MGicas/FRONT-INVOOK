import { axiosInstance } from "../../../../shared/modules/instances/AxiosInstance";
import type { ConsumCreateRequest, ConsumCreateResponse } from "../../model/Consum";

export const postConsum = async (data: ConsumCreateRequest): Promise<ConsumCreateResponse> => {
    const response = await axiosInstance.post("/consum/", data);
    return response.data;
};