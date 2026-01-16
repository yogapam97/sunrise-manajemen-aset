import { useState, useEffect, useCallback } from "react";

import { Box, Dialog, IconButton, DialogTitle, DialogContent } from "@mui/material";

import { useBoolean } from "src/hooks/use-boolean";

import Iconify from "src/components/iconify";

import OperationLogListTable from "../../core/operation-log/OperationLogListTable";
import OperationLogFilterForm from "../../core/operation-log/OperationLogFilterForm";
import { useGetAllOperationLogs, useDownloadOperationLogs } from "../../hook/useOperationLogs";

type OperationLogTableContainerProps = {
  workspaceId: string;
  filter?: any;
  onFilter?: (values: any) => void;
  config?: any;
  onFullScreen?: VoidFunction;
};

type MappedFilter = {
  fixed_asset?: string[];
  operation_type?: string[];
  operation_group?: string[];
  metric?: string[];
  old_assignee?: string[];
  new_assignee?: string[];
  old_location?: string[];
  new_location?: string[];
  old_lifecycle?: string[];
  new_lifecycle?: string[];
  start_date?: Date;
  end_date?: Date;
};

export default function OperationLogTableContainer({
  workspaceId,
  filter,
  onFilter,
  config,
  onFullScreen,
}: OperationLogTableContainerProps) {
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(50);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("updated_at:desc");
  const filterOperationLog = useBoolean();

  const [mappedFilter, setMappedFilter] = useState<MappedFilter>({});

  const { refetch: refetchDownloadCSV, isFetching: loadingDownloadCSV } = useDownloadOperationLogs(
    workspaceId,
    {
      filter: mappedFilter,
      search,
    }
  );

  const { data: operationLogsData, isLoading } = useGetAllOperationLogs(workspaceId, {
    filter: mappedFilter,
    search,
    limit,
    page,
    sort,
  });

  const handleOpenDialogFilter = () => {
    filterOperationLog.onTrue();
  };

  const handleSubmitFilter = (values: any) => {
    if (onFilter) {
      onFilter(values);
    }
    filterOperationLog.onFalse();
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
      link.setAttribute("download", `operation_logs-${formattedDate}.csv`);
      document.body.appendChild(link);
      link.click();
    }
  }, [refetchDownloadCSV]);

  useEffect(() => {
    setMappedFilter({
      fixed_asset: filter?.fixed_asset,
      operation_type: filter?.operation_type,
      operation_group: filter?.operation_group?.map((item: any) =>
        typeof item === "string" ? item : item.id
      ),
      metric: filter?.metric?.map((item: any) => (typeof item === "string" ? item : item.id)),
      old_assignee: filter?.old_assignee?.map((item: any) =>
        typeof item === "string" ? item : item.id
      ),
      new_assignee: filter?.new_assignee?.map((item: any) =>
        typeof item === "string" ? item : item.id
      ),
      old_location: filter?.old_location?.map((item: any) =>
        typeof item === "string" ? item : item.id
      ),
      new_location: filter?.new_location?.map((item: any) =>
        typeof item === "string" ? item : item.id
      ),
      old_lifecycle: filter?.old_lifecycle?.map((item: any) =>
        typeof item === "string" ? item : item.id
      ),
      new_lifecycle: filter?.new_lifecycle?.map((item: any) =>
        typeof item === "string" ? item : item.id
      ),
      start_date: filter?.start_date,
      end_date: filter?.end_date,
    });
  }, [filter]);

  return (
    <>
      <OperationLogListTable
        onFullScreen={onFullScreen}
        config={config}
        workspaceId={workspaceId}
        operationLogs={operationLogsData?.data}
        pagination={operationLogsData?.pagination}
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

      <Dialog maxWidth={false} open={filterOperationLog.value}>
        <DialogTitle align="center" variant="subtitle2">
          Filter Operation Log
        </DialogTitle>
        <DialogContent>
          <Box sx={{ width: 720, height: 1, overflow: "hidden" }}>
            <OperationLogFilterForm
              config={config}
              defaultFilter={filter}
              onFilter={handleSubmitFilter}
            />
          </Box>
        </DialogContent>
        <IconButton
          aria-label="close"
          onClick={filterOperationLog.onFalse}
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
