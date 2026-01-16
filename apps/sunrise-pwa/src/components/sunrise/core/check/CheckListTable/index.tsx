import type { ICheckItem } from "src/types/check";
import type { IPagination } from "src/types/pagination";

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

import CheckTableRow from "./CheckTableRow";
import CheckTableToolbar from "./CheckTableToolbar";

const TABLE_HEAD = [
  { id: "created_at", label: "Date Time", alwaysShow: true },
  { id: "status", label: "Status", alwaysShow: true },
  { id: "fixed_asset", label: "Fixed Asset", show: true },
  { id: "note", label: "Note", show: true },
  { id: "assignee", label: "Assignee", show: true },
  { id: "location", label: "Location", show: true },
  { id: "checked_by", label: "Checked By", show: true },
];

const SORT_OPTIONS = [
  { value: "updated_at:desc", label: "Latest Update" },
  { value: "created_at:desc", label: "Create Newest" },
  { value: "created_at:asc", label: "Create Oldest" },
];

type CheckListTableProps = {
  workspaceId: string;
  checks: ICheckItem[];
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
export default function CheckListTable({
  workspaceId,
  checks,
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
}: CheckListTableProps) {
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
      <CheckTableToolbar
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
            <TableHeadCustom headLabel={configColumns} rowCount={checks?.length || 0} />

            <TableBody>
              {loading ? (
                [...Array(5)].map((i, index) => <TableSkeleton key={index} sx={{ height: 60 }} />)
              ) : (
                <>
                  {checks.map((row) => (
                    <CheckTableRow
                      workspaceId={workspaceId}
                      key={row.id}
                      configColumns={configColumns}
                      row={row}
                      config={config}
                    />
                  ))}
                  {checks.length < 40 && checks.length > 0 && (
                    <TableEmptyRows height={10} emptyRows={50} />
                  )}

                  <TableNoData notFound={!checks.length && !loading} />
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
          rowsPerPageOptions={checks?.length > 50 ? [50, 100, 150, 200, 250] : []}
          dense
        />
      )}
    </Card>
  );
}
