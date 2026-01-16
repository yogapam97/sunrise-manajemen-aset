import type { IPagination } from "src/types/pagination";
import type { IDepreciationItem } from "src/types/depreciation";

import { useState } from "react";

import { Card, Table, TableBody, TableContainer } from "@mui/material";

import Iconify from "src/components/iconify";
import Scrollbar from "src/components/scrollbar";
import {
  TableNoData,
  TableSkeleton,
  TableEmptyRows,
  TableHeadCustom,
  TablePaginationCustom,
} from "src/components/table";

import DepreciationTableRow from "./DepreciationTableRow";
import DepreciationTableToolbar from "./DepreciationTableToolbar";
import {
  ALPHA_ASC_ICON,
  ALPHA_DESC_ICON,
  CREATE_NEWEST_ICON,
  CREATE_OLDEST_ICON,
  LATEST_UPDATE_ICON,
} from "../../icon-definitions";

const TABLE_HEAD = [
  {
    id: "",
    label: <Iconify icon="eva:more-vertical-fill" />,
    width: "1px",
    align: "center",
    alwaysShow: true,
  },
  { id: "name", label: "Fixed Asset", alwaysShow: true },
  { id: "serial_number", label: "Serial Number", show: false },
  { id: "type", label: "Type", show: false },
  { id: "description", label: "Description", show: false },
  { id: "lifecycle", label: "Lifecycle", show: false },
  { id: "category", label: "Category", show: false },
  { id: "location", label: "Location", show: false },
  { id: "supplier", label: "Supplier", show: false },
  { id: "assignee", label: "Assignee", show: false },
  { id: "purchase_date", label: "Purchase Date", show: false },
  { id: "active_start_date", label: "Active Start Date", show: true },
  { id: "active_end_date", label: "Active End Date", show: true },
  { id: "purchase_cost", label: "Purchase Cost", show: true },
  { id: "depreciation_rate", label: "Daily Loss", show: true },
  { id: "depreciation_purchase_cost", label: "Total Loss", show: true },
  { id: "current_purchase_cost", label: "Current Value", alwaysShow: true },
];

const SORT_OPTIONS = [
  { value: "updated_at:desc", label: "Latest Update", icon: LATEST_UPDATE_ICON },
  { value: "created_at:desc", label: "Create Newest", icon: CREATE_NEWEST_ICON },
  { value: "created_at:asc", label: "Create Oldest", icon: CREATE_OLDEST_ICON },
  { value: "name:asc", label: "Name A to Z", icon: ALPHA_ASC_ICON },
  { value: "name:desc", label: "Name Z to A", icon: ALPHA_DESC_ICON },
];

type DepreciationListTableProps = {
  workspaceId: string;
  fixedAssets: IDepreciationItem[];
  pagination: IPagination;
  loading: boolean;
  onLimitChange: (limit: number) => void;
  onPageChange: (page: number) => void;
  onSearch: (search: string) => void;
  onDownloadCSV: () => void;
  loadingDownloadCSV: boolean;
  onClickFilter: VoidFunction;
  config: { hideFilter: boolean };
  onSortChange?: (sort: string) => void;
  onDeleteRow: (id: string) => void;
};
export default function DepreciationListTable({
  workspaceId,
  fixedAssets,
  loading,
  pagination,
  onLimitChange,
  onPageChange,
  onSearch,
  onDownloadCSV,
  loadingDownloadCSV,
  onClickFilter,
  onSortChange,
  config,
  onDeleteRow,
}: DepreciationListTableProps) {
  const [configColumns, setConfigColumns] = useState<any[]>(TABLE_HEAD);
  const [selectedSort, setSelectedSort] = useState<string>("updated_at:desc");

  const handlePageChange = (event: unknown, newPage: number) => {
    onPageChange(newPage + 1);
  };
  const handleLimitChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onLimitChange(parseInt(event.target.value, 10));
  };

  const handleSelectedSort = (sort: string) => {
    setSelectedSort(sort);
    if (onSortChange) {
      onSortChange(sort);
    }
  };

  return (
    <Card>
      <DepreciationTableToolbar
        hideFilter={config?.hideFilter}
        onClickFilter={onClickFilter}
        onDownloadCSV={onDownloadCSV}
        loadingDownloadCSV={loadingDownloadCSV}
        onSearch={onSearch}
        columns={configColumns}
        onChangeColumns={setConfigColumns}
        sortOptions={SORT_OPTIONS}
        selectedSort={selectedSort}
        onSelectedSort={handleSelectedSort}
      />
      <TableContainer sx={{ position: "relative", overflow: "unset" }}>
        <Scrollbar>
          <Table size="medium" sx={{ minWidth: 960 }}>
            <TableHeadCustom headLabel={configColumns} rowCount={fixedAssets?.length || 0} />

            <TableBody>
              {loading ? (
                [...Array(5)].map((i, index) => <TableSkeleton key={index} sx={{ height: 60 }} />)
              ) : (
                <>
                  {fixedAssets.map((row) => (
                    <DepreciationTableRow
                      workspaceId={workspaceId}
                      configColumns={configColumns}
                      key={row.id}
                      row={row}
                      onDeleteRow={() => onDeleteRow(row.id as string)}
                    />
                  ))}

                  {fixedAssets.length < 40 && fixedAssets.length > 0 && (
                    <TableEmptyRows height={10} emptyRows={50} />
                  )}

                  <TableNoData notFound={!fixedAssets.length && !loading} />
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
          rowsPerPageOptions={fixedAssets?.length > 50 ? [50, 100, 150, 200, 250] : []}
          dense
        />
      )}
    </Card>
  );
}
