import axios, { endpoints } from "../utils/axios";

interface IGetAllOperationLogs {
  search?: string;
  limit?: number;
  page?: number;
  sort?: string;
  filter?: any;
}
export const getAllOperationLogs = async (
  workspaceId: string,
  { search, limit, page, sort, filter }: IGetAllOperationLogs
): Promise<any> => {
  const response = await axios.get(`${endpoints.operationLog}`, {
    params: { search, limit, page, sort, ...filter },
    headers: { "X-Workspace-Id": workspaceId },
  });
  return response.data;
};

export const getOperationLogIdById = async (operationLogId: string): Promise<any> => {
  const response = await axios.get(`${endpoints.operationLog}/${operationLogId}`);
  return response.data;
};

interface IDownloadOperationLogs {
  search?: string;
  filter?: any;
}
export const downloadOperationLogs = async (
  workspaceId: string,
  { search, filter }: IDownloadOperationLogs
): Promise<any> => {
  const response = await axios.get(`${endpoints.operationLogDownload}`, {
    params: { search, ...filter },
    headers: { "X-Workspace-Id": workspaceId },
    responseType: "blob",
  });
  return response.data;
};
