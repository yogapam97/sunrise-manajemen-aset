import type { ILifecyclePayload } from "src/types/lifecycle";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { createLifecycle, deleteLifecycle, getAllLifecycles } from "src/api/lifecycle-api";

export const useGetAllLifecycles = (
  workspaceId: string,
  options: {
    search: string;
    limit?: number;
    page?: number;
    sort?: string;
    is_maintenance_cycle?: boolean;
  }
) => {
  const { search, limit, page, sort, is_maintenance_cycle } = options;
  return useQuery({
    queryKey: ["lifecycles", search, limit, page, sort, is_maintenance_cycle],
    queryFn: () =>
      getAllLifecycles(workspaceId, { search, limit, page, sort, is_maintenance_cycle }),
  });
};

export const useCreateLifecycle = (options: any) => {
  const queryClient = useQueryClient();
  return useMutation((lifecycle: ILifecyclePayload) => createLifecycle(lifecycle), {
    onSuccess: (response) => {
      queryClient.invalidateQueries(["lifecycles"]);
      if (options.onSuccess) options.onSuccess(response);
    },
    onError: (error: any) => {
      if (options.onError) options.onError(error);
    },
  });
};

export const useDeleteLifecycle = () => {
  const queryClient = useQueryClient();

  return useMutation((lifecycleId: string) => deleteLifecycle(lifecycleId), {
    onSuccess: () => {
      queryClient.invalidateQueries(["lifecycles"]);
    },
  });
};
