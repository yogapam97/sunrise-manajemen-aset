import axios, { endpoints } from "../utils/axios";

interface IGetAllDepreciations {
  search?: string;
  limit?: number;
  page?: number;
  filter?: any;
  sort?: string;
}
export const getAllDepreciations = async (
  workspaceId: string,
  { search, limit, page, filter, sort }: IGetAllDepreciations
): Promise<any> => {
  const response = await axios.get(`${endpoints.depreciation}`, {
    params: { search, limit, page, sort, ...filter },
    headers: {
      "X-Workspace-Id": workspaceId,
    },
  });
  return response.data;
};

export const findDepreciationById = async (
  workspaceId: string,
  fixedAssetId: string
): Promise<any> => {
  const response = await axios.get(`${endpoints.depreciation}/${fixedAssetId}`, {
    headers: { "X-Workspace-Id": workspaceId },
  });
  return response.data;
};

interface IDownloadDepreciations {
  search?: string;
  filter?: any;
}
export const downloadDepreciations = async (
  workspaceId: string,
  { search, filter }: IDownloadDepreciations
): Promise<any> => {
  const response = await axios.get(`${endpoints.depreciationDownload}`, {
    params: { search, ...filter },
    headers: { "X-Workspace-Id": workspaceId },
    responseType: "blob",
  });
  return response.data;
};
