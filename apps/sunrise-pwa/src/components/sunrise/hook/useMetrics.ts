import type { IMetricPayload } from "src/types/metric";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {
  createMetric,
  deleteMetric,
  updateMetric,
  getAllMetrics,
  getMetricById,
} from "src/api/metric-api";

export const useGetAllMetrics = (
  workspaceId: string,
  options: { search: string; limit?: number; page?: number; sort?: string }
) => {
  const { search, limit, page, sort } = options;
  return useQuery({
    queryKey: ["metrics", search, limit, page, sort],
    queryFn: () => getAllMetrics(workspaceId, { search, limit, page, sort }),
  });
};

export const useGetMetricById = (metricId: string) =>
  useQuery({
    queryKey: ["metrics", metricId],
    queryFn: () => getMetricById(metricId),
  });

export const useCreateMetric = (options: any) => {
  const queryClient = useQueryClient();
  return useMutation((transition: IMetricPayload) => createMetric(transition), {
    onSuccess: (response) => {
      queryClient.invalidateQueries(["transitions"]);
      if (options.onSuccess) options.onSuccess(response);
    },
    onError: (error) => {
      if (options.onError) options.onError(error);
    },
  });
};

export const useUpdateMetric = (metricId: string, options: any) => {
  const queryClient = useQueryClient();
  return useMutation((metric: IMetricPayload) => updateMetric(metricId, metric), {
    onSuccess: (response) => {
      queryClient.invalidateQueries(["metrics"]);
      if (options.onSuccess) options.onSuccess(response);
    },
    onError: (error) => {
      if (options.onError) options.onError(error);
    },
  });
};

export const useDeleteMetric = () => {
  const queryClient = useQueryClient();

  return useMutation((metricId: string) => deleteMetric(metricId), {
    onSuccess: () => {
      queryClient.invalidateQueries(["metrics"]);
    },
  });
};
