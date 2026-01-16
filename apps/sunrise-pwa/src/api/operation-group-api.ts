import type { IOperationGroupPayload } from "src/types/operation-group";

import axios, { endpoints } from "../utils/axios";

interface IGetAllOperationGroups {
  search?: string;
  limit?: number;
  page?: number;
  sort?: string;
}
export const getAllOperationGroups = async (
  workspaceId: string,
  { search, limit, page, sort }: IGetAllOperationGroups
): Promise<any> => {
  const response = await axios.get(`${endpoints.operationGroup}`, {
    params: { search, limit, page, sort },
    headers: { "X-Workspace-Id": workspaceId },
  });
  return response.data;
};

export const getOperationGroupById = async (operationGroupId: string): Promise<any> => {
  const response = await axios.get(`${endpoints.operationGroup}/${operationGroupId}`);
  return response.data;
};

export const createOperationGroup = async (
  operationGroup: IOperationGroupPayload
): Promise<any> => {
  const response = await axios.post(endpoints.operationGroup, operationGroup);
  return response.data;
};

export const createOperationGroupDo = async (
  operationGroupId: string,
  operationGroupDo: any
): Promise<any> => {
  const response = await axios.post(
    `${endpoints.operationGroup}/${operationGroupId}/do`,
    operationGroupDo
  );
  return response.data;
};

export const updateOperationGroup = async (
  operationGroupId: string,
  operationGroup: IOperationGroupPayload
): Promise<any> => {
  const response = await axios.patch(
    `${endpoints.operationGroup}/${operationGroupId}`,
    operationGroup
  );
  return response.data;
};

export const deleteOperationGroup = async (operationGroupId: string): Promise<any> => {
  const response = await axios.delete(`${endpoints.operationGroup}/${operationGroupId}`);
  return response.data;
};

export const getOperationGroupFixedAssets = async (
  workspaceId: string,
  operationGroupId: string
): Promise<any> => {
  const response = await axios.get(`${endpoints.operationGroup}/${operationGroupId}/fixed-assets`, {
    headers: { "X-Workspace-Id": workspaceId },
  });
  return response.data;
};
