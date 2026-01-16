import type { ILocationPayload } from "src/types/location";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { createLocation, deleteLocation, getAllLocations } from "src/api/location-api";

export const useGetAllLocations = (
  workspaceId: string,
  options: { search: string; limit?: number; page?: number; sort?: string }
) => {
  const { search, limit, page, sort } = options;
  return useQuery({
    queryKey: ["locations", search, limit, page, sort],
    queryFn: () => getAllLocations(workspaceId, { search, limit, page, sort }),
  });
};

export const useCreateLocation = (options: any) => {
  const queryClient = useQueryClient();
  return useMutation((category: ILocationPayload) => createLocation(category), {
    onSuccess: (response) => {
      queryClient.invalidateQueries(["locations"]);
      if (options.onSuccess) options.onSuccess(response);
    },
    onError: (error: any) => {
      if (options.onError) options.onError(error);
    },
  });
};

export const useDeleteLocation = () => {
  const queryClient = useQueryClient();

  return useMutation((locationId: string) => deleteLocation(locationId), {
    onSuccess: () => {
      queryClient.invalidateQueries(["locations"]);
    },
  });
};
