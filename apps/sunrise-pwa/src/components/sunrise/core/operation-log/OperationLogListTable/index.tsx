import type { IPagination } from "src/types/pagination";
import type { IOperationLogItem } from "src/types/operation-log";

import { useState, useEffect } from "react";

import { Card, Table, TableBody, TableContainer } from "@mui/material";

import Scrollbar from "src/components/scrollbar";
import {
  TableNoData,
  TableSkeleton,
  TableEmptyRows,
  TableHeadCustom,
  TablePaginationCustom,
} from "src/components/table";

import OperationLogTableRow from "./OperationLogTableRow";
import OperationLogTableToolbar from "./OperationLogTableToolbar";
import { CREATE_NEWEST_ICON, CREATE_OLDEST_ICON } from "../../icon-definitions";

const TABLE_HEAD = [
  { id: "created_at", label: "Date Time", alwaysShow: true },
  { id: "operation_key", label: "Operation Key", alwaysShow: true },
  { id: "operation_group", label: "Operation Group", alwaysShow: true },
  { id: "operation_type", label: "Operation Type", alwaysShow: true },
  { id: "fixed_asset", label: "Fixed Asset", show: true },
  { id: "details", label: "Details", show: true },
  { id: "note", label: "Note", show: true },
  { id: "operation_subject", label: "Operated By", show: true },
];

const SORT_OPTIONS = [
  { value: "created_at:desc", label: "Create Newest", icon: CREATE_NEWEST_ICON },
  { value: "created_at:asc", label: "Create Oldest", icon: CREATE_OLDEST_ICON },
];

type OperationLogListTableProps = {
  workspaceId: string;
  operationLogs: IOperationLogItem[];
  pagination: IPagination;
  loading: boolean;
  onSearch: (search: string) => void;
  onLimitChange: (limit: number) => void;
  onPageChange: (page: number) => void;
  onSortChange?: (sort: string) => void;
  onClickFilter: VoidFunction;
  onDownloadCSV: () => void;
  onFullScreen?: VoidFunction;
  loadingDownloadCSV: boolean;
  config?: any;
};
export default function OperationLogListTable({
  workspaceId,
  operationLogs,
  loading,
  pagination,
  onSearch,
  onPageChange,
  onLimitChange,
  onSortChange,
  onClickFilter,
  onDownloadCSV,
  loadingDownloadCSV,
  onFullScreen,
  config,
}: OperationLogListTableProps) {
  const [configColumns, setConfigColumns] = useState<any[]>(TABLE_HEAD);
  const [selectedSort, setSelectedSort] = useState(SORT_OPTIONS[0]?.value);

  const handlePageChange = (event: unknown, newPage: number) => {
    onPageChange(newPage + 1);
  };
  const handleLimitChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onLimitChange(Number(event.target.value));
  };

  const handleSelectedSort = (sort: string) => {
    setSelectedSort(sort);
    if (onSortChange) {
      onSortChange(sort);
    }
  };

  useEffect(() => {
    if (config?.hideColumnFixedAsset) {
      setConfigColumns(TABLE_HEAD.filter((item) => item.id !== "fixed_asset"));
    }
  }, [config]);

  return (
    <Card>
      <OperationLogTableToolbar
        onSearch={onSearch}
        selectedSort={selectedSort}
        onSelectedSort={handleSelectedSort}
        sortOptions={SORT_OPTIONS}
        hideSearch={config?.hideSearch}
        onClickFilter={onClickFilter}
        onDownloadCSV={onDownloadCSV}
        onFullScreen={onFullScreen}
        loadingDownloadCSV={loadingDownloadCSV}
        config={config}
      />
      <TableContainer sx={{ position: "relative", overflow: "unset" }}>
        <Scrollbar>
          <Table size="medium" sx={{ minWidth: 960 }}>
            <TableHeadCustom headLabel={configColumns} rowCount={operationLogs?.length || 0} />

            <TableBody>
              {loading ? (
                [...Array(5)].map((i, index) => <TableSkeleton key={index} sx={{ height: 60 }} />)
              ) : (
                <>
                  {operationLogs.map((row) => (
                    <OperationLogTableRow
                      workspaceId={workspaceId}
                      key={row.id}
                      configColumns={configColumns}
                      row={row}
                      config={config}
                    />
                  ))}
                  {operationLogs.length < 40 && operationLogs.length > 0 && (
                    <TableEmptyRows height={10} emptyRows={50} />
                  )}

                  <TableNoData notFound={!operationLogs.length && !loading} />
                </>
              )}
            </TableBody>
          </Table>
        </Scrollbar>
      </TableContainer>

      {!loading && (
        <TablePaginationCustom
          count={pagination.total as number}
          page={(pagination.page as number) - 1}
          rowsPerPage={pagination.limit as number}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleLimitChange}
          rowsPerPageOptions={operationLogs?.length > 50 ? [50, 100, 150, 200, 250] : []}
          dense
        />
      )}
    </Card>
  );
}
