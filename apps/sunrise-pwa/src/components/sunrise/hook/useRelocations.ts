import type { IRelocationPayload } from "src/types/relocation";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { createRelocation, deleteRelocation, getAllRelocations } from "src/api/relocation-api";

export const useGetAllRelocations = (
  workspaceId: string,
  options: { search: string; limit: number; page: number; sort: string }
) => {
  const { search, limit, page, sort } = options;
  return useQuery({
    queryKey: ["relocations", search, limit, page, sort],
    queryFn: () => getAllRelocations(workspaceId, { search, limit, page, sort }),
  });
};

export const useCreateRelocation = (options: any) => {
  const queryClient = useQueryClient();
  return useMutation((relocation: IRelocationPayload) => createRelocation(relocation), {
    onSuccess: (response) => {
      queryClient.invalidateQueries(["relocations"]);
      if (options.onSuccess) options.onSuccess(response);
    },
    onError: (error) => {
      if (options.onError) options.onError(error);
    },
  });
};

export const useDeleteRelocation = () => {
  const queryClient = useQueryClient();

  return useMutation((relocationId: string) => deleteRelocation(relocationId), {
    onSuccess: () => {
      queryClient.invalidateQueries(["relocations"]);
    },
  });
};
