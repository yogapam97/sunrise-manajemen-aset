import type { IAssignmentPayload } from "src/types/assignment";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { createAssignment, getAllAssignments } from "src/api/assignment-api";

export const useGetAllAssignments = (
  workspaceId: string,
  options: { search: string; limit: number; page: number; sort: string }
) => {
  const { search, limit, page, sort } = options;
  return useQuery({
    queryKey: ["assignments", search, limit, page, sort],
    queryFn: () => getAllAssignments(workspaceId, { search, limit, page, sort }),
  });
};

export const useCreateAssignment = (options: any) => {
  const queryClient = useQueryClient();
  return useMutation((assignment: IAssignmentPayload) => createAssignment(assignment), {
    onSuccess: (response) => {
      queryClient.invalidateQueries(["assignments"]);
      if (options.onSuccess) options.onSuccess(response);
    },
    onError: (error) => {
      if (options.onError) options.onError(error);
    },
  });
};
