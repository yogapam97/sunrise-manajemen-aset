import { useState, useEffect, useCallback } from "react";

import { Box, Dialog, IconButton, DialogTitle, DialogContent } from "@mui/material";

import { useBoolean } from "src/hooks/use-boolean";

import Iconify from "src/components/iconify";

import { useDeleteFixedAsset } from "../../hook/useFixedAssets";
import FixedAssetFilterForm from "../../core/fixed-asset/FixedAssetFilterForm";
import DepreciationListTable from "../../core/depreciation/DepreciationListTable";
import { useGetAllDepreciations, useDownloadDepreciations } from "../../hook/useDepreciations";

type DepreciationTableContainerProps = {
  workspaceId: string;
  config?: any;
  filter?: any;
  onFilter?: (values: any) => void;
};

export default function DepreciationTableContainer({
  workspaceId,
  config,
  filter,
  onFilter,
}: DepreciationTableContainerProps) {
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(50);
  const [page, setPage] = useState(1);
  const filterFixedAsset = useBoolean();
  const [mappedFilter, setMappedFilter] = useState<any>({});
  const [sort, setSort] = useState<string>("updated_at:desc");

  const { data: fixedAssetsData, isLoading } = useGetAllDepreciations(workspaceId, {
    filter: mappedFilter,
    search,
    limit,
    page,
    sort,
  });

  const { refetch: refetchDownloadCSV, isFetching: loadingDownloadCSV } = useDownloadDepreciations(
    workspaceId,
    {
      filter: mappedFilter,
      search,
    }
  );

  const deleteMutation = useDeleteFixedAsset();

  const handleDeleteFixedAsset = useCallback(
    (fixedAssetId: string) => {
      deleteMutation.mutate(fixedAssetId);
    },
    [deleteMutation]
  );

  const handleDownloadCSV = useCallback(async () => {
    const { data } = await refetchDownloadCSV();
    if (data) {
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement("a");
      link.href = url;
      const date = new Date();
      const formattedDate =
        date.toISOString().slice(0, 10).replace(/-/g, "") +
        date.toTimeString().slice(0, 8).replace(/:/g, "");
      link.setAttribute("download", `depreciations-${formattedDate}.csv`);
      document.body.appendChild(link);
      link.click();
    }
  }, [refetchDownloadCSV]);

  const handleSubmitFilter = (values: any) => {
    if (onFilter) {
      onFilter(values);
    }
    filterFixedAsset.onFalse();
  };

  useEffect(() => {
    setMappedFilter({
      code: filter?.code,
      serial_number: filter?.serial_number,
      lifecycle: filter?.lifecycle?.map((item: any) => (typeof item === "string" ? item : item.id)),
      category: filter?.category?.map((item: any) => (typeof item === "string" ? item : item.id)),
      location: filter?.location?.map((item: any) => (typeof item === "string" ? item : item.id)),
      assignee: filter?.assignee?.map((item: any) => (typeof item === "string" ? item : item.id)),
      supplier: filter?.supplier?.map((item: any) => (typeof item === "string" ? item : item.id)),
    });
  }, [filter]);

  return (
    <>
      <DepreciationListTable
        workspaceId={workspaceId}
        fixedAssets={fixedAssetsData?.data}
        pagination={fixedAssetsData?.pagination}
        loading={isLoading}
        onSearch={setSearch}
        onDeleteRow={handleDeleteFixedAsset}
        onDownloadCSV={handleDownloadCSV}
        loadingDownloadCSV={loadingDownloadCSV}
        onLimitChange={(newLimit: number) => {
          setLimit(newLimit);
          setPage(1);
        }}
        onPageChange={setPage}
        onClickFilter={filterFixedAsset.onTrue}
        config={config}
        onSortChange={setSort}
      />

      <Dialog open={filterFixedAsset.value}>
        <DialogTitle align="center" variant="subtitle2">
          Filter Fixed Asset
        </DialogTitle>
        <DialogContent>
          <Box sx={{ width: 320, height: 1, overflow: "hidden" }}>
            <FixedAssetFilterForm defaultFilter={filter} onFilter={handleSubmitFilter} />
          </Box>
        </DialogContent>
        <IconButton
          aria-label="close"
          onClick={filterFixedAsset.onFalse}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme: any) => theme.palette.grey[500],
          }}
        >
          <Iconify icon="solar:close-circle-outline" />
        </IconButton>
      </Dialog>
    </>
  );
}
