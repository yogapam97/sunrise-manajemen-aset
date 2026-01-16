import type { ICheckPayload } from "src/types/check";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { createCheck, getAllChecks, downloadChecks } from "src/api/check-api";

export const useGetAllChecks = (
  workspaceId: string,
  options: { search: string; limit: number; page: number; sort: string; filter: any }
) => {
  const { search, limit, page, sort, filter } = options;
  return useQuery({
    queryKey: ["checks", search, limit, page, sort, filter],
    queryFn: () => getAllChecks(workspaceId, { search, limit, page, sort, filter }),
  });
};

export const useCreateCheck = (options: any) => {
  const queryClient = useQueryClient();
  return useMutation((check: ICheckPayload) => createCheck(check), {
    onSuccess: (response) => {
      queryClient.invalidateQueries(["checks"]);
      if (options.onSuccess) options.onSuccess(response);
    },
    onError: (error) => {
      if (options.onError) options.onError(error);
    },
  });
};

export const useDownloadChecks = (
  workspaceId: string,
  options: { search: string; filter: any }
) => {
  const { search, filter } = options;
  return useQuery({
    queryKey: ["downloadCheckCSV"],
    queryFn: () => downloadChecks(workspaceId, { search, filter }),
    enabled: false,
    refetchOnWindowFocus: false,
  });
};
