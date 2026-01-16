import type { IOperationGroupPayload } from "src/types/operation-group";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {
  createOperationGroup,
  deleteOperationGroup,
  updateOperationGroup,
  getAllOperationGroups,
  getOperationGroupById,
  createOperationGroupDo,
} from "src/api/operation-group-api";

export const useGetAllOperationGroups = (
  workspaceId: string,
  options: { search: string; limit: number; page: number; sort: string; filter: any }
) => {
  const { search, limit, page, sort, filter } = options;
  return useQuery({
    queryKey: ["operationGroups", search, limit, page, sort, filter],
    queryFn: () => getAllOperationGroups(workspaceId, { search, limit, page, sort, ...filter }),
  });
};

export const useGetOperationGroupById = (operationGroupId: string) =>
  useQuery({
    queryKey: ["operationGroups", operationGroupId],
    queryFn: () => getOperationGroupById(operationGroupId),
  });

export const useCreateOperationGroup = (options: any) => {
  const queryClient = useQueryClient();
  return useMutation(
    (operationGroup: IOperationGroupPayload) => createOperationGroup(operationGroup),
    {
      onSuccess: (response) => {
        queryClient.invalidateQueries(["operationGroups"]);
        if (options.onSuccess) options.onSuccess(response);
      },
      onError: (error) => {
        if (options.onError) options.onError(error);
      },
    }
  );
};

export const useCreateOperationGroupDo = (operationGroupId: string, options: any) => {
  const queryClient = useQueryClient();
  return useMutation(
    (operationGroup: IOperationGroupPayload) =>
      createOperationGroupDo(operationGroupId, operationGroup),
    {
      onSuccess: (response) => {
        queryClient.invalidateQueries(["operationGroups", operationGroupId]);
        if (options.onSuccess) options.onSuccess(response);
      },
      onError: (error) => {
        if (options.onError) options.onError(error);
      },
    }
  );
};

export const useUpdateOperationGroup = (operationGroupId: string, options: any) => {
  const queryClient = useQueryClient();
  return useMutation(
    (operationGroup: IOperationGroupPayload) =>
      updateOperationGroup(operationGroupId, operationGroup),
    {
      onSuccess: (response) => {
        queryClient.invalidateQueries(["operationGroups"]);
        if (options.onSuccess) options.onSuccess(response);
      },
      onError: (error) => {
        if (options.onError) options.onError(error);
      },
    }
  );
};

export const useDeleteOperationGroup = () => {
  const queryClient = useQueryClient();

  return useMutation((operationGroupId: string) => deleteOperationGroup(operationGroupId), {
    onSuccess: () => {
      queryClient.invalidateQueries(["operationGroups"]);
    },
  });
};
