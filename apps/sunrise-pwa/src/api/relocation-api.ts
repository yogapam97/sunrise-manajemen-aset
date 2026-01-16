import type { IRelocationPayload } from "src/types/relocation";

import axios, { endpoints } from "../utils/axios";

interface IGetAllRelocations {
  search?: string;
  limit?: number;
  page?: number;
  sort?: string;
}
export const getAllRelocations = async (
  workspaceId: string,
  { search, limit, page, sort }: IGetAllRelocations
): Promise<any> => {
  const response = await axios.get(`${endpoints.relocation}`, {
    params: { search, limit, page, sort },
    headers: { "X-Workspace-Id": workspaceId },
  });
  return response.data;
};

export const getRelocationIdById = async (relocationId: string): Promise<any> => {
  const response = await axios.get(`${endpoints.relocation}/${relocationId}`);
  return response.data;
};

export const createRelocation = async (relocation: IRelocationPayload): Promise<any> => {
  const response = await axios.post(endpoints.relocation, relocation);
  return response.data;
};

export const updateRelocation = async (
  relocationId: string,
  relocation: IRelocationPayload
): Promise<any> => {
  const response = await axios.patch(`${endpoints.relocation}/${relocationId}`, relocation);
  return response.data;
};

export const deleteRelocation = async (relocationId: string): Promise<any> => {
  const response = await axios.delete(`${endpoints.relocation}/${relocationId}`);
  return response.data;
};

export const getRelocationFixedAssets = async (
  workspaceId: string,
  relocationId: string
): Promise<any> => {
  const response = await axios.get(`${endpoints.relocation}/${relocationId}/fixed-assets`, {
    headers: { "X-Workspace-Id": workspaceId },
  });
  return response.data;
};
