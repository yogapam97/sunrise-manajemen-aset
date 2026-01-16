import type { IMetricPayload } from "src/types/metric";

import axios, { endpoints } from "../utils/axios";

interface IGetAllMetrics {
  search?: string;
  limit?: number;
  page?: number;
  sort?: string;
}
export const getAllMetrics = async (
  workspaceId: string,
  { search, limit, page, sort }: IGetAllMetrics
): Promise<any> => {
  const response = await axios.get(`${endpoints.metric}`, {
    params: { search, limit, page, sort },
    headers: { "X-Workspace-Id": workspaceId },
  });
  return response.data;
};

export const getMetricById = async (metricId: string): Promise<any> => {
  const response = await axios.get(`${endpoints.metric}/${metricId}`);
  return response.data;
};

export const createMetric = async (metric: IMetricPayload): Promise<any> => {
  const response = await axios.post(endpoints.metric, metric);
  return response.data;
};

export const updateMetric = async (metricId: string, metric: IMetricPayload): Promise<any> => {
  const response = await axios.patch(`${endpoints.metric}/${metricId}`, metric);
  return response.data;
};

export const deleteMetric = async (metricId: string): Promise<any> => {
  const response = await axios.delete(`${endpoints.metric}/${metricId}`);
  return response.data;
};

export const getMetricFixedAssets = async (workspaceId: string, metricId: string): Promise<any> => {
  const response = await axios.get(`${endpoints.metric}/${metricId}/fixed-assets`, {
    headers: { "X-Workspace-Id": workspaceId },
  });
  return response.data;
};
