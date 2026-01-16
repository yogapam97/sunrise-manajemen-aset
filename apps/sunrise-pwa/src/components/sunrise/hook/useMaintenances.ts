import type { IMaintenancePayload } from "src/types/maintenance";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {
  createMaintenance,
  getAllMaintenances,
  downloadMaintenances,
} from "src/api/maintenance-api";

export const useGetAllMaintenances = (
  workspaceId: string,
  options: { search: string; limit: number; page: number; sort: string; filter: any }
) => {
  const { search, limit, page, sort, filter } = options;
  return useQuery({
    queryKey: ["maintenances", search, limit, page, sort, filter],
    queryFn: () => getAllMaintenances(workspaceId, { search, limit, page, sort, filter }),
  });
};

export const useCreateMaintenance = (options: any) => {
  const queryClient = useQueryClient();
  return useMutation((maintenance: IMaintenancePayload) => createMaintenance(maintenance), {
    onSuccess: (response) => {
      queryClient.invalidateQueries(["maintenances"]);
      if (options.onSuccess) options.onSuccess(response);
    },
    onError: (error) => {
      if (options.onError) options.onError(error);
    },
  });
};

export const useDownloadMaintenances = (
  workspaceId: string,
  options: { search: string; filter: any }
) => {
  const { search, filter } = options;
  return useQuery({
    queryKey: ["downloadMaintenanceCSV"],
    queryFn: () => downloadMaintenances(workspaceId, { search, filter }),
    enabled: false,
    refetchOnWindowFocus: false,
  });
};
