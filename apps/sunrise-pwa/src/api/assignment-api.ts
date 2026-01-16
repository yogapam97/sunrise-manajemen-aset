import type { IAssignmentPayload } from "src/types/assignment";

import axios, { endpoints } from "../utils/axios";

interface IGetAllAssignments {
  search?: string;
  limit?: number;
  page?: number;
  sort?: string;
}
export const getAllAssignments = async (
  workspaceId: string,
  { search, limit, page, sort }: IGetAllAssignments
): Promise<any> => {
  const response = await axios.get(`${endpoints.assignment}`, {
    params: { search, limit, page, sort },
    headers: { "X-Workspace-Id": workspaceId },
  });
  return response.data;
};

export const getAssignmentIdById = async (assignmentId: string): Promise<any> => {
  const response = await axios.get(`${endpoints.assignment}/${assignmentId}`);
  return response.data;
};

export const createAssignment = async (assignment: IAssignmentPayload): Promise<any> => {
  const response = await axios.post(endpoints.assignment, assignment);
  return response.data;
};
