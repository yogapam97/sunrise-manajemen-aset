import type { ILifecyclePayload } from "src/types/lifecycle";

import axios, { endpoints } from "../utils/axios";

interface IGetAllLifecycles {
  search?: string;
  limit?: number;
  page?: number;
  sort?: string;
  is_maintenance_cycle?: boolean;
}
export const getAllLifecycles = async (
  workspaceId: string,
  { search, limit, page, sort, is_maintenance_cycle }: IGetAllLifecycles
): Promise<any> => {
  const response = await axios.get(`${endpoints.lifecycle}`, {
    params: { search, limit, page, sort, is_maintenance_cycle },
    headers: { "X-Workspace-Id": workspaceId },
  });
  return response.data;
};

export const getLifecycleIdById = async (lifecycleId: string): Promise<any> => {
  const response = await axios.get(`${endpoints.lifecycle}/${lifecycleId}`);
  return response.data;
};

export const createLifecycle = async (lifecycle: ILifecyclePayload): Promise<any> => {
  const response = await axios.post(endpoints.lifecycle, lifecycle);
  return response.data;
};

export const updateLifecycle = async (
  lifecycleId: string,
  lifecycle: ILifecyclePayload
): Promise<any> => {
  const response = await axios.patch(`${endpoints.lifecycle}/${lifecycleId}`, lifecycle);
  return response.data;
};

export const deleteLifecycle = async (lifecycleId: string): Promise<any> => {
  const response = await axios.delete(`${endpoints.lifecycle}/${lifecycleId}`);
  return response.data;
};

export const getLifecycleFixedAssets = async (
  workspaceId: string,
  lifecycleId: string
): Promise<any> => {
  const response = await axios.get(`${endpoints.lifecycle}/${lifecycleId}/fixed-assets`, {
    headers: { "X-Workspace-Id": workspaceId },
  });
  return response.data;
};
