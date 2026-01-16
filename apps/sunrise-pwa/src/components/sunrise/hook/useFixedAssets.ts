import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { createLabels } from "src/api/label-generator-api";
import {
  deleteFixedAsset,
  getAllFixedAssets,
  getFixedAssetById,
  downloadFixedAssets,
  getFixedAssetReportCount,
  getFixedAssetReportTotalPurchaseCost,
  getFixedAssetReportTotalDepreciation,
} from "src/api/fixed-asset-api";

import { CHECK_IN_ICON, CHECK_OUT_ICON } from "../core/icon-definitions";

export const useGetAllFixedAssets = (
  workspaceId: string,
  options: { search: string; limit: number; page: number; filter: any; sort: string }
) => {
  const { search, limit, page, filter, sort } = options;
  return useQuery({
    queryKey: ["fixedAssets", search, limit, page, filter, sort],
    queryFn: () => getAllFixedAssets(workspaceId, { search, limit, page, filter, sort }),
  });
};

export const useGetFixedAssetById = (workspaceId: string, fixedAssetId: string) =>
  useQuery({
    queryKey: ["fixedAsset", fixedAssetId],
    queryFn: () => getFixedAssetById(workspaceId, fixedAssetId),
    enabled: !!fixedAssetId,
  });

export const useDeleteFixedAsset = (options?: any) => {
  const queryClient = useQueryClient();

  return useMutation((fixedAssetId: string) => deleteFixedAsset(fixedAssetId), {
    onSuccess: () => {
      queryClient.invalidateQueries(["fixedAssets"]);
      if (options.onSuccess) options.onSuccess();
    },
  });
};

export const useGenerateLabelFixedAsset = (
  workspaceId: string,
  options: { onSuccess(response: any): void }
) => {
  const queryClient = useQueryClient();
  const { onSuccess } = options; // Define the 'onSuccess' variable
  return useMutation(
    (fixedAssetIds: string[]) =>
      createLabels(workspaceId, {
        fixed_assets: fixedAssetIds.map((fixedAssetId) => ({ id: fixedAssetId })),
      }),
    {
      onSuccess: (response) => {
        queryClient.invalidateQueries(["labelGenerators"]);
        if (onSuccess) onSuccess(response);
      },
    }
  );
};

export const useDownloadFixedAssets = (
  workspaceId: string,
  options: { search: string; filter: any }
) => {
  const { search, filter } = options;
  return useQuery({
    queryKey: ["downloadFixedAssetCSV"],
    queryFn: () => downloadFixedAssets(workspaceId, { search, filter }),
    enabled: false,
    refetchOnWindowFocus: false,
  });
};

export const useFindFixedAsset = (
  workspaceId: string,
  options: { onSuccess(response: any): void }
) => {
  const queryClient = useQueryClient();
  const { onSuccess } = options; // Define the 'onSuccess' variable
  return useMutation((fixedAssetId: string) => getFixedAssetById(workspaceId, fixedAssetId), {
    ...options,
    onSuccess: (response) => {
      queryClient.invalidateQueries(["fixedAsset", response.data.id]);
      if (onSuccess) onSuccess(response);
    },
  });
};

export const useGetAllFixedAssetsReportCount = (workspaceId: string) =>
  useQuery({
    queryKey: ["fixedAssetsReportCount"],
    queryFn: () => getFixedAssetReportCount(workspaceId),
  });

export const useGetFixedAssetsReportTotalPurchaseCost = (workspaceId: string) =>
  useQuery({
    queryKey: ["fixedAssetsReportTotalPurchaseCost"],
    queryFn: () => getFixedAssetReportTotalPurchaseCost(workspaceId),
  });

export const useGetFixedAssetsReportTotalDepreciation = (workspaceId: string) =>
  useQuery({
    queryKey: ["fixedAssetsReportTotalDepreciation"],
    queryFn: () => getFixedAssetReportTotalDepreciation(workspaceId),
  });

export const useGetCurrentCheckAction =
  () =>
  (current_check: any, is_current: boolean = false): any => {
    const checkOut = {
      status: "check-out",
      text: "Check Out",
      icon: CHECK_OUT_ICON,
      color: "warning",
    };

    const checkIn = {
      status: "check-in",
      text: "Check In",
      icon: CHECK_IN_ICON,
      color: "primary",
    };
    if (is_current) {
      if (!current_check) return checkIn;
      if (current_check?.status === "check-out") return checkOut;
      return checkIn;
    }

    if (!current_check) return checkOut;
    if (current_check?.status === "check-out") return checkIn;
    return checkOut;
  };
