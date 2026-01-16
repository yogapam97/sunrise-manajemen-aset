import type { IMemberPayload } from "src/types/member";

import axios, { endpoints } from "../utils/axios";

interface IGetAllMembers {
  search?: string;
  limit?: number;
  page?: number;
  sort?: string;
}
export const getAllMembers = async (
  workspaceId: string,
  { search, limit, page, sort }: IGetAllMembers
): Promise<any> => {
  const response = await axios.get(`${endpoints.member}`, {
    params: { search, limit, page, sort },
    headers: { "X-Workspace-Id": workspaceId },
  });
  return response.data;
};

export const getMemberById = async (memberId: string): Promise<any> => {
  const response = await axios.get(`${endpoints.member}/${memberId}`);
  return response.data;
};

export const createMember = async (workspaceId: string, member: IMemberPayload): Promise<any> => {
  const response = await axios.post(endpoints.member, member, {
    headers: { "X-Workspace-Id": workspaceId },
  });
  return response.data;
};

export const resendInvitationMember = async (
  workspaceId: string,
  memberId: string
): Promise<any> => {
  const response = await axios.post(
    `${endpoints.member}/${memberId}/resend-invitation`,
    {},
    {
      headers: { "X-Workspace-Id": workspaceId },
    }
  );
  return response.data;
};

export const resetPasswordMember = async (workspaceId: string, memberId: string): Promise<any> => {
  const response = await axios.post(
    `${endpoints.member}/${memberId}/reset-password`,
    {},
    {
      headers: { "X-Workspace-Id": workspaceId },
    }
  );
  return response.data;
};

export const updateMember = async (memberId: string, member: IMemberPayload): Promise<any> => {
  const response = await axios.patch(`${endpoints.member}/${memberId}`, member);
  return response.data;
};

export const deleteMember = async (memberId: string): Promise<any> => {
  const response = await axios.delete(`${endpoints.member}/${memberId}`);
  return response.data;
};

export const getMemberFixedAssets = async (workspaceId: string, memberId: string): Promise<any> => {
  const response = await axios.get(`${endpoints.member}/${memberId}/fixed-assets`, {
    headers: { "X-Workspace-Id": workspaceId },
  });
  return response.data;
};
