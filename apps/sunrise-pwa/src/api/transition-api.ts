import type { ITransitionPayload } from "src/types/transition";

import axios, { endpoints } from "../utils/axios";

interface IGetAllTransitions {
  search?: string;
  limit?: number;
  page?: number;
  sort?: string;
}
export const getAllTransitions = async (
  workspaceId: string,
  { search, limit, page, sort }: IGetAllTransitions
): Promise<any> => {
  const response = await axios.get(`${endpoints.transition}`, {
    params: { search, limit, page, sort },
    headers: { "X-Workspace-Id": workspaceId },
  });
  return response.data;
};

export const getTransitionIdById = async (transitionId: string): Promise<any> => {
  const response = await axios.get(`${endpoints.transition}/${transitionId}`);
  return response.data;
};

export const createTransition = async (transition: ITransitionPayload): Promise<any> => {
  const response = await axios.post(endpoints.transition, transition);
  return response.data;
};
