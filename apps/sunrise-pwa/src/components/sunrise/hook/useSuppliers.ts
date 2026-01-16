import type { ISupplierPayload } from "src/types/supplier";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { createSupplier, deleteSupplier, getAllSuppliers } from "src/api/supplier-api";

export const useGetAllSuppliers = (
  workspaceId: string,
  options: { search: string; limit?: number; page?: number; sort?: string }
) => {
  const { search, limit, page, sort } = options;
  return useQuery({
    queryKey: ["suppliers", search, limit, page, sort],
    queryFn: () => getAllSuppliers(workspaceId, { search, limit, page, sort }),
  });
};

export const useCreateSupplier = (options: any) => {
  const queryClient = useQueryClient();
  return useMutation((category: ISupplierPayload) => createSupplier(category), {
    onSuccess: (response) => {
      queryClient.invalidateQueries(["suppliers"]);
      if (options.onSuccess) options.onSuccess(response);
    },
    onError: (error: any) => {
      if (options.onError) options.onError(error);
    },
  });
};

export const useDeleteSupplier = () => {
  const queryClient = useQueryClient();

  return useMutation((supplierId: string) => deleteSupplier(supplierId), {
    onSuccess: () => {
      queryClient.invalidateQueries(["suppliers"]);
    },
  });
};
