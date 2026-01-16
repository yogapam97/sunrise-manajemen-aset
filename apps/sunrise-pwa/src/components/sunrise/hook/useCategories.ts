import type { ICategoryPayload } from "src/types/category";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { createCategory, deleteCategory, getAllCategories } from "src/api/category-api";

export const useGetAllCategories = (
  workspaceId: string,
  options: { search: string; limit?: number; page?: number; sort?: string }
) => {
  const { search, limit, page, sort } = options;
  return useQuery({
    queryKey: ["categories", search, limit, page, sort],
    queryFn: () => getAllCategories(workspaceId, { search, limit, page, sort }),
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation((categoryId: string) => deleteCategory(categoryId), {
    onSuccess: () => {
      queryClient.invalidateQueries(["categories"]);
    },
  });
};

export const useCreateCategory = (options: any) => {
  const queryClient = useQueryClient();
  return useMutation((category: ICategoryPayload) => createCategory(category), {
    onSuccess: (response) => {
      queryClient.invalidateQueries(["categories"]);
      if (options.onSuccess) options.onSuccess(response);
    },
    onError: (error: any) => {
      if (options.onError) options.onError(error);
    },
  });
};
