import type { IUserPayload } from "src/types/user";

import axios, { endpoints } from "../utils/axios";

interface IGetAllUsers {
  search?: string;
}
export const getAllUsers = async ({ search }: IGetAllUsers): Promise<any> => {
  const response = await axios.get(`${endpoints.user}?search=${search}`);
  return response.data;
};

export const getUserIdById = async (userId: string): Promise<any> => {
  const response = await axios.get(`${endpoints.user}/${userId}`);
  return response.data;
};

export const createUser = async (user: IUserPayload): Promise<any> => {
  const response = await axios.post(endpoints.user, user);
  return response.data;
};

export const updateUser = async (userId: string, user: IUserPayload): Promise<any> => {
  const response = await axios.patch(`${endpoints.user}/${userId}`, user);
  return response.data;
};

export const deleteUser = async (userId: string): Promise<any> => {
  const response = await axios.delete(`${endpoints.user}/${userId}`);
  return response.data;
};
