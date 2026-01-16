import type { IAuditItem } from "src/types/audit";
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

import AuditTableRow from "./AuditTableRow";
import AuditTableToolbar from "./AuditTableToolbar";
import { CREATE_NEWEST_ICON, CREATE_OLDEST_ICON } from "../../icon-definitions";

const TABLE_HEAD = [
  { id: "created_at", label: "Date Time", alwaysShow: true },
  { id: "fixed_asset", label: "Fixed Asset", show: true },
  { id: "note", label: "Note", show: true },
  { id: "value", label: "Value", show: true },
  { id: "metric", label: "Metric", show: true },
  { id: "audited_by", label: "Audited By", show: true },
];

const SORT_OPTIONS = [
  { value: "created_at:desc", label: "Create Newest", icon: CREATE_NEWEST_ICON },
  { value: "created_at:asc", label: "Create Oldest", icon: CREATE_OLDEST_ICON },
];

type AuditListTableProps = {
  workspaceId: string;
  audits: IAuditItem[];
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
export default function AuditListTable({
  workspaceId,
  audits,
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
}: AuditListTableProps) {
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
      <AuditTableToolbar
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
            <TableHeadCustom headLabel={configColumns} rowCount={audits?.length || 0} />

            <TableBody>
              {loading ? (
                [...Array(5)].map((i, index) => <TableSkeleton key={index} sx={{ height: 60 }} />)
              ) : (
                <>
                  {audits.map((row) => (
                    <AuditTableRow
                      workspaceId={workspaceId}
                      key={row.id}
                      configColumns={configColumns}
                      row={row}
                      config={config}
                    />
                  ))}
                  {audits.length < 40 && audits.length > 0 && (
                    <TableEmptyRows height={10} emptyRows={50} />
                  )}

                  <TableNoData notFound={!audits.length && !loading} />
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
          rowsPerPageOptions={audits?.length > 50 ? [50, 100, 150, 200, 250] : []}
          dense
        />
      )}
    </Card>
  );
}
