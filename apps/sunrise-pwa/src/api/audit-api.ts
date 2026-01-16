import type { IAuditPayload } from "src/types/audit";

import axios, { endpoints } from "../utils/axios";

interface IGetAllAudits {
  search?: string;
  limit?: number;
  page?: number;
  sort?: string;
  filter?: any;
}
export const getAllAudits = async (
  workspaceId: string,
  { search, limit, page, sort, filter }: IGetAllAudits
): Promise<any> => {
  const response = await axios.get(`${endpoints.audit}`, {
    params: { search, limit, page, sort, ...filter },
    headers: { "X-Workspace-Id": workspaceId },
  });
  return response.data;
};

export const getAuditById = async (auditId: string): Promise<any> => {
  const response = await axios.get(`${endpoints.audit}/${auditId}`);
  return response.data;
};

export const createAudit = async (audit: IAuditPayload): Promise<any> => {
  const response = await axios.post(endpoints.audit, audit);
  return response.data;
};
