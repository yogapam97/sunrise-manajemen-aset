import type { ITransitionPayload } from "src/types/transition";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { createTransition, getAllTransitions } from "src/api/transition-api";

export const useGetAllTransitions = (
  workspaceId: string,
  options: { search: string; limit: number; page: number; sort: string }
) => {
  const { search, limit, page, sort } = options;
  return useQuery({
    queryKey: ["transitions", search, limit, page, sort],
    queryFn: () => getAllTransitions(workspaceId, { search, limit, page, sort }),
  });
};

export const useCreateTransition = (options: any) => {
  const queryClient = useQueryClient();
  return useMutation((transition: ITransitionPayload) => createTransition(transition), {
    onSuccess: (response) => {
      queryClient.invalidateQueries(["transitions"]);
      if (options.onSuccess) options.onSuccess(response);
    },
    onError: (error) => {
      if (options.onError) options.onError(error);
    },
  });
};
