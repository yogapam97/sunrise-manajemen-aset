import { useState, useEffect, useCallback } from "react";

import { Box, Dialog, IconButton, DialogTitle, DialogContent } from "@mui/material";

import { useBoolean } from "src/hooks/use-boolean";

import Iconify from "src/components/iconify";

import CheckListTable from "../../core/check/CheckListTable";
import CheckFilterForm from "../../core/check/CheckFilterForm";
import { useGetAllChecks, useDownloadChecks } from "../../hook/useChecks";

type CheckTableContainerProps = {
  workspaceId: string;
  filter?: any;
  onFilter?: (values: any) => void;
  config?: any;
  onFullScreen?: VoidFunction;
};

type MappedFilter = {
  fixed_asset?: string[];
  status?: string[];
  assignee?: string[];
  location?: string[];
  start_date?: Date;
  end_date?: Date;
};

export default function CheckTableContainer({
  workspaceId,
  filter,
  onFilter,
  config,
  onFullScreen,
}: CheckTableContainerProps) {
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(50);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("updated_at:desc");
  const filterCheck = useBoolean();

  const [mappedFilter, setMappedFilter] = useState<MappedFilter>({});

  const { refetch: refetchDownloadCSV, isFetching: loadingDownloadCSV } = useDownloadChecks(
    workspaceId,
    {
      filter: mappedFilter,
      search,
    }
  );

  const { data: checksData, isLoading } = useGetAllChecks(workspaceId, {
    filter: mappedFilter,
    search,
    limit,
    page,
    sort,
  });

  const handleOpenDialogFilter = () => {
    filterCheck.onTrue();
  };

  const handleSubmitFilter = (values: any) => {
    if (onFilter) {
      onFilter(values);
    }
    filterCheck.onFalse();
  };
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
      link.setAttribute("download", `check_in_out-${formattedDate}.csv`);
      document.body.appendChild(link);
      link.click();
    }
  }, [refetchDownloadCSV]);

  useEffect(() => {
    setMappedFilter({
      fixed_asset: filter?.fixed_asset,
      status: filter?.status,
      assignee: filter?.assignee?.map((item: any) => (typeof item === "string" ? item : item.id)),
      location: filter?.location?.map((item: any) => (typeof item === "string" ? item : item.id)),
      start_date: filter?.start_date,
      end_date: filter?.end_date,
    });
  }, [filter]);

  return (
    <>
      <CheckListTable
        onFullScreen={onFullScreen}
        config={config}
        workspaceId={workspaceId}
        checks={checksData?.data}
        pagination={checksData?.pagination}
        loading={isLoading}
        onSearch={setSearch}
        onLimitChange={(newLimit: number) => {
          setLimit(newLimit);
          setPage(1);
        }}
        onPageChange={setPage}
        onSortChange={setSort}
        onClickFilter={handleOpenDialogFilter}
        onDownloadCSV={handleDownloadCSV}
        loadingDownloadCSV={loadingDownloadCSV}
      />

      <Dialog maxWidth={false} open={filterCheck.value}>
        <DialogTitle align="center" variant="subtitle2">
          Filter Check In/Out
        </DialogTitle>
        <DialogContent>
          <Box sx={{ width: 480, height: 1, overflow: "hidden" }}>
            <CheckFilterForm config={config} defaultFilter={filter} onFilter={handleSubmitFilter} />
          </Box>
        </DialogContent>
        <IconButton
          aria-label="close"
          onClick={filterCheck.onFalse}
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
