import type { IMaintenancePayload } from "src/types/maintenance";

import axios, { endpoints } from "../utils/axios";

interface IGetAllMaintenances {
  search?: string;
  limit?: number;
  page?: number;
  sort?: string;
  filter?: any;
}
export const getAllMaintenances = async (
  workspaceId: string,
  { search, limit, page, sort, filter }: IGetAllMaintenances
): Promise<any> => {
  const response = await axios.get(`${endpoints.maintenance}`, {
    params: { search, limit, page, sort, ...filter },
    headers: { "X-Workspace-Id": workspaceId },
  });
  return response.data;
};

export const getMaintenanceIdById = async (maintenanceId: string): Promise<any> => {
  const response = await axios.get(`${endpoints.maintenance}/${maintenanceId}`);
  return response.data;
};

export const createMaintenance = async (maintenance: IMaintenancePayload): Promise<any> => {
  const response = await axios.post(endpoints.maintenance, maintenance);
  return response.data;
};

interface IDownloadMaintenances {
  search?: string;
  filter?: any;
}
export const downloadMaintenances = async (
  workspaceId: string,
  { search, filter }: IDownloadMaintenances
): Promise<any> => {
  const response = await axios.get(`${endpoints.maintenanceDownload}`, {
    params: { search, ...filter },
    headers: { "X-Workspace-Id": workspaceId },
    responseType: "blob",
  });
  return response.data;
};
