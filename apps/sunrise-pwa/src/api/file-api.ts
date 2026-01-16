import type { AxiosProgressEvent } from "axios";

import axios, { endpoints } from "../utils/axios";

export const uploadFile = async (
  file: File,
  onUploadProgress: (progressEvent: AxiosProgressEvent) => void
): Promise<any> => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await axios.post(endpoints.file, formData, {
      onUploadProgress,
    });
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message || "Failed to upload");
  }
};
