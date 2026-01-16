import type { IWorkspacePayload } from "src/types/workspace";

import axios, { endpoints } from "../utils/axios";

interface IGetAllWorkspaces {
  search?: string;
}
export const getAllWorkspaces = async ({ search }: IGetAllWorkspaces): Promise<any> => {
  const response = await axios.get(`${endpoints.workspace}?search=${search}`);
  return response.data;
};

export const getInvitedWorkspaces = async ({ search }: IGetAllWorkspaces): Promise<any> => {
  const response = await axios.get(
    `${endpoints.workspace}?search=${search}&&invitation_status=pending`
  );
  return response.data;
};

export const getWorkspaceById = async (workspaceId: string): Promise<any> => {
  const response = await axios.get(`${endpoints.workspace}/${workspaceId}`);
  return response.data;
};

export const selectWorkspace = async (workspaceId: string): Promise<any> => {
  const response = await axios.get(`${endpoints.workspace}/${workspaceId}/select`, {
    headers: { "X-Workspace-Id": workspaceId },
  });
  return response.data;
};

export const getMyWorkspace = async (workspaceId: string): Promise<any> => {
  const response = await axios.get(`${endpoints.workspace}/${workspaceId}/me`);
  return response.data;
};

export const createWorkspace = async (workspace: IWorkspacePayload): Promise<any> => {
  const response = await axios.post(endpoints.workspace, workspace);
  return response.data;
};

export const updateWorkspace = async (
  workspaceId: string,
  workspace: IWorkspacePayload
): Promise<any> => {
  const response = await axios.patch(`${endpoints.workspace}/${workspaceId}`, workspace);
  return response.data;
};

export const deleteWorkspace = async (workspaceId: string): Promise<any> => {
  const response = await axios.delete(`${endpoints.workspace}/${workspaceId}`);
  return response.data;
};

export const joinWorkspace = async (workspaceId: string): Promise<any> => {
  const response = await axios.post(`${endpoints.workspace}/${workspaceId}/accept-invitation`);
  return response.data;
};

export const rejectWorkspace = async (workspaceId: string): Promise<any> => {
  const response = await axios.post(`${endpoints.workspace}/${workspaceId}/reject-invitation`);
  return response.data;
};
