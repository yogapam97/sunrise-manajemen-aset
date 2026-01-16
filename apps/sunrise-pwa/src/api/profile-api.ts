import type IProfilePayload from "src/types/profile";

import axiosInstance, { endpoints } from "src/utils/axios";

export const updateProfile = async (profilePayload: IProfilePayload): Promise<any> => {
  const response = await axiosInstance.patch(`${endpoints.auth.profile}`, profilePayload);
  return response.data;
};
