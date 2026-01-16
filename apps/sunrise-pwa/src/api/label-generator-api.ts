import axios, { endpoints } from "../utils/axios";

export const createLabels = async (workspaceId: string, fixed_assets: any): Promise<any> => {
  const response = await axios.post(endpoints.labelGenerator, fixed_assets, {
    headers: { "X-Workspace-Id": workspaceId },
  });
  return response.data;
};
