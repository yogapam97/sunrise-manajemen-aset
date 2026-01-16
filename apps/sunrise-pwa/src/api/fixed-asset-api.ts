import type { IFixedAssetPayload } from "src/types/fixed-asset";

import axios, { endpoints } from "../utils/axios";

interface IGetAllFixedAssets {
  search?: string;
  limit?: number;
  page?: number;
  sort?: string;
  filter?: any;
}
export const getAllFixedAssets = async (
  workspaceId: string,
  { search, limit, page, filter, sort }: IGetAllFixedAssets
): Promise<any> => {
  const response = await axios.get(`${endpoints.fixedAsset}`, {
    params: { search, limit, page, sort, ...filter },
    headers: { "X-Workspace-Id": workspaceId },
  });
  return response.data;
};

export const getFixedAssetById = async (
  workspaceId: string,
  fixedAssetId: string
): Promise<any> => {
  const response = await axios.get(`${endpoints.fixedAsset}/${fixedAssetId}`, {
    headers: { "X-Workspace-Id": workspaceId },
  });
  return response.data;
};

export const createFixedAsset = async (
  workspaceId: string,
  fixedAsset: IFixedAssetPayload
): Promise<any> => {
  const response = await axios.post(
    endpoints.fixedAsset,
    {
      ...fixedAsset,
      category: fixedAsset?.category?.id,
      location: fixedAsset?.location?.id,
      lifecycle: fixedAsset?.lifecycle?.id,
      assignee: fixedAsset?.assignee?.id,
      supplier: fixedAsset?.supplier?.id,
    },
    {
      headers: { "X-Workspace-Id": workspaceId },
    }
  );
  return response.data;
};

export const importFixedAsset = async (workspaceId: string, fixedAssets: any[]): Promise<any> => {
  const response = await axios.post(
    endpoints.fixedAssetImport,
    { fixedAssets },
    {
      headers: { "X-Workspace-Id": workspaceId },
    }
  );
  return response.data;
};

export const updateFixedAsset = async (
  workspaceId: string,
  fixedAssetId: string,
  fixedAsset: IFixedAssetPayload
): Promise<any> => {
  const response = await axios.patch(
    `${endpoints.fixedAsset}/${fixedAssetId}`,
    {
      ...fixedAsset,
      category: fixedAsset?.category?.id,
      location: fixedAsset?.location?.id,
      lifecycle: fixedAsset?.lifecycle?.id,
      assignee: fixedAsset?.assignee?.id,
      supplier: fixedAsset?.supplier?.id,
    },
    {
      headers: { "X-Workspace-Id": workspaceId },
    }
  );
  return response.data;
};

export const deleteFixedAsset = async (fixedAssetId: string): Promise<any> => {
  const response = await axios.delete(`${endpoints.fixedAsset}/${fixedAssetId}`);
  return response.data;
};

interface IDownloadFixedAssets {
  search?: string;
  filter?: any;
}
export const downloadFixedAssets = async (
  workspaceId: string,
  { search, filter }: IDownloadFixedAssets
): Promise<any> => {
  const response = await axios.get(`${endpoints.fixedAssetDownload}`, {
    params: { search, ...filter },
    headers: { "X-Workspace-Id": workspaceId },
    responseType: "blob",
  });
  return response.data;
};

export const getFixedAssetReportCount = async (workspaceId: string): Promise<any> => {
  const response = await axios.get(`${endpoints.fixedAssetReport}/count`, {
    headers: { "X-Workspace-Id": workspaceId },
  });
  return response.data;
};

export const getFixedAssetReportTotalPurchaseCost = async (workspaceId: string): Promise<any> => {
  const response = await axios.get(`${endpoints.fixedAssetReport}/total-purchase-cost`, {
    headers: { "X-Workspace-Id": workspaceId },
  });
  return response.data;
};

export const getFixedAssetReportTotalDepreciation = async (workspaceId: string): Promise<any> => {
  const response = await axios.get(`${endpoints.fixedAssetReport}/total-depreciation`, {
    headers: { "X-Workspace-Id": workspaceId },
  });
  return response.data;
};
