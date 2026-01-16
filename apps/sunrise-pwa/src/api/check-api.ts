import type { ICheckPayload } from "src/types/check";

import axios, { endpoints } from "../utils/axios";

interface IGetAllChecks {
  search?: string;
  limit?: number;
  page?: number;
  sort?: string;
  filter?: any;
}
export const getAllChecks = async (
  workspaceId: string,
  { search, limit, page, sort, filter }: IGetAllChecks
): Promise<any> => {
  const response = await axios.get(`${endpoints.check}`, {
    params: { search, limit, page, sort, ...filter },
    headers: { "X-Workspace-Id": workspaceId },
  });
  return response.data;
};

export const getCheckIdById = async (checkId: string): Promise<any> => {
  const response = await axios.get(`${endpoints.check}/${checkId}`);
  return response.data;
};

export const createCheck = async (check: ICheckPayload): Promise<any> => {
  const response = await axios.post(endpoints.check, check);
  return response.data;
};

interface IDownloadChecks {
  search?: string;
  filter?: any;
}
export const downloadChecks = async (
  workspaceId: string,
  { search, filter }: IDownloadChecks
): Promise<any> => {
  const response = await axios.get(`${endpoints.checkDownload}`, {
    params: { search, ...filter },
    headers: { "X-Workspace-Id": workspaceId },
    responseType: "blob",
  });
  return response.data;
};
