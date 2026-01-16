import { useQuery } from "@tanstack/react-query";

import {
  getAllDepreciations,
  findDepreciationById,
  downloadDepreciations,
} from "src/api/depreciation-api";

export const useGetAllDepreciations = (
  workspaceId: string,
  options: { search: string; limit: number; page: number; filter: any; sort: string }
) => {
  const { search, limit, page, filter, sort } = options;
  return useQuery({
    queryKey: ["fixedAssets", search, limit, page, filter, sort],
    queryFn: () => getAllDepreciations(workspaceId, { search, limit, page, filter, sort }),
  });
};

export const useFindDepreciation = (workspaceId: string, fixedAssetId: string) =>
  useQuery({
    queryKey: ["depreciation", fixedAssetId],
    queryFn: () => findDepreciationById(workspaceId, fixedAssetId),
  });

export const useDownloadDepreciations = (
  workspaceId: string,
  options: { search: string; filter: any }
) => {
  const { search, filter } = options;
  return useQuery({
    queryKey: ["downloadFixedAssetCSV"],
    queryFn: () => downloadDepreciations(workspaceId, { search, filter }),
    enabled: false,
    refetchOnWindowFocus: false,
  });
};
