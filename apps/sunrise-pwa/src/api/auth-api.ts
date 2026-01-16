import axios, { endpoints } from "src/utils/axios";

export const resetPassword = async (email: string): Promise<any> => {
  const response = await axios.post(`${endpoints.auth.resetPassword}`, email);
  return response.data;
};

export const newPassword = async (email: string): Promise<any> => {
  const response = await axios.post(`${endpoints.auth.newPassword}`, email);
  return response.data;
};

export const verifyEmail = async (): Promise<any> => {
  const response = await axios.post(`${endpoints.auth.verifyEmail}`, {});
  return response.data;
};

export const verifiedEmail = async (token: any): Promise<any> => {
  const response = await axios.post(`${endpoints.auth.verifiedEmail}`, token);
  return response.data;
};

export const deleteProfile = async (): Promise<any> => {
  const response = await axios.delete(`${endpoints.auth.profile}`);
  return response.data;
};
