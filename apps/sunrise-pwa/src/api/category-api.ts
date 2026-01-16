import type { ICategoryPayload } from "src/types/category";

import axios, { endpoints } from "../utils/axios";

interface IGetAllCategories {
  search?: string;
  limit?: number;
  page?: number;
  sort?: string;
}
export const getAllCategories = async (
  workspaceId: string,
  { search, limit, page, sort }: IGetAllCategories
): Promise<any> => {
  const response = await axios.get(`${endpoints.category}`, {
    params: { search, limit, page, sort },
    headers: { "X-Workspace-Id": workspaceId },
  });
  return response.data;
};

export const getCategoryIdById = async (categoryId: string): Promise<any> => {
  const response = await axios.get(`${endpoints.category}/${categoryId}`);
  return response.data;
};

export const createCategory = async (category: ICategoryPayload): Promise<any> => {
  const response = await axios.post(endpoints.category, category);
  return response.data;
};

export const updateCategory = async (
  categoryId: string,
  category: ICategoryPayload
): Promise<any> => {
  const response = await axios.patch(`${endpoints.category}/${categoryId}`, category);
  return response.data;
};

export const deleteCategory = async (categoryId: string): Promise<any> => {
  const response = await axios.delete(`${endpoints.category}/${categoryId}`);
  return response.data;
};

export const getCategoryFixedAssets = async (
  workspaceId: string,
  categoryId: string
): Promise<any> => {
  const response = await axios.get(`${endpoints.category}/${categoryId}/fixed-assets`, {
    headers: { "X-Workspace-Id": workspaceId },
  });
  return response.data;
};
