import { useQuery } from "@tanstack/react-query";

import { getAllOperationLogs, downloadOperationLogs } from "src/api/operation-log-api";

export const useGetAllOperationLogs = (
  workspaceId: string,
  options: { search: string; limit: number; page: number; sort: string; filter: any }
) => {
  const { search, limit, page, sort, filter } = options;
  return useQuery({
    queryKey: ["operation-logs", search, limit, page, sort, filter],
    queryFn: () => getAllOperationLogs(workspaceId, { search, limit, page, sort, filter }),
  });
};

export const useDownloadOperationLogs = (
  workspaceId: string,
  options: { search: string; filter: any }
) => {
  const { search, filter } = options;
  return useQuery({
    queryKey: ["downloadFixedAssetCSV"],
    queryFn: () => downloadOperationLogs(workspaceId, { search, filter }),
    enabled: false,
    refetchOnWindowFocus: false,
  });
};
