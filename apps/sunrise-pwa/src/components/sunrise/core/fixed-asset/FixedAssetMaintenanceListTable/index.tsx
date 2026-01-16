import type { IPagination } from "src/types/pagination";
import type { IFixedAssetItem } from "src/types/fixed-asset";

import { useState } from "react";

import { Card, Table, TableBody, TableContainer } from "@mui/material";

import Scrollbar from "src/components/scrollbar";
import {
  useTable,
  TableNoData,
  TableSkeleton,
  TableEmptyRows,
  TableHeadCustom,
  TablePaginationCustom,
} from "src/components/table";

import FixedAssetMaintenanceTableRow from "./FixedAssetMaintenanceTableRow";
import FixedAssetMaintenanceTableToolbar from "./FixedAssetMaintenanceTableToolbar";
import {
  ALPHA_ASC_ICON,
  ALPHA_DESC_ICON,
  CREATE_NEWEST_ICON,
  CREATE_OLDEST_ICON,
  LATEST_UPDATE_ICON,
} from "../../icon-definitions";

const TABLE_HEAD = [
  { id: "maintenance_next_date", label: "Due Maintenance", show: true },
  { id: "fixed_asset", label: "Fixed Asset", alwaysShow: true },
  { id: "lifecycle", label: "Lifecycle", show: true },
  { id: "action", label: "Action", show: true },
  { id: "maintenance_cost", label: "Last Maintenance Cost", show: true },
  { id: "maintenance_date", label: "Last Maintenance Date", show: true },
  { id: "note", label: "Note", show: true },
  { id: "maintained_by", label: "Last Maintained By", show: true },
];

const SORT_OPTIONS = [
  { value: "updated_at:desc", label: "Latest Update", icon: LATEST_UPDATE_ICON },
  {
    value: "maintenance_next_date:asc",
    label: "Maintenance Due Nearest",
    icon: CREATE_NEWEST_ICON,
  },
  {
    value: "maintenance_next_date:desc",
    label: "Maintenance Due Latest",
    icon: CREATE_OLDEST_ICON,
  },
  { value: "name:asc", label: "Name A to Z", icon: ALPHA_ASC_ICON },
  { value: "name:desc", label: "Name Z to A", icon: ALPHA_DESC_ICON },
];

type FixedAssetMaintenanceListTableProps = {
  workspaceId: string;
  fixedAssets: IFixedAssetItem[];
  pagination: IPagination;
  loading: boolean;
  onSearch: (search: string) => void;
  onLimitChange: (limit: number) => void;
  onPageChange: (page: number) => void;
  config: { hideImport: boolean; hideFilter: boolean };
  onClickFilter: VoidFunction;
  onSortChange?: (sort: string) => void;
  onFullScreen: VoidFunction;
};
export default function FixedAssetMaintenanceListTable({
  workspaceId,
  fixedAssets,
  loading,
  pagination,
  onSearch,
  onLimitChange,
  onPageChange,
  config,
  onClickFilter,
  onSortChange,
  onFullScreen,
}: FixedAssetMaintenanceListTableProps) {
  const table = useTable();
  const [configColumns, setConfigColumns] = useState<any[]>(TABLE_HEAD);
  const [selectedSort, setSelectedSort] = useState(SORT_OPTIONS[1]?.value || "");

  const handleLimitChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onLimitChange(parseInt(event.target.value, 10));
  };

  const handlePageChange = (event: unknown, newPage: number) => {
    onPageChange(newPage + 1);
  };

  const handleChangeColumns = (columns: any[]) => {
    setConfigColumns(columns);
  };

  const handleSelectedSort = (sort: string) => {
    setSelectedSort(sort);
    if (onSortChange) {
      onSortChange(sort);
    }
  };

  return (
    <Card>
      <FixedAssetMaintenanceTableToolbar
        sortOptions={SORT_OPTIONS}
        selectedSort={selectedSort}
        onClickFilter={onClickFilter}
        hideFilter={config?.hideFilter}
        onSearch={onSearch}
        columns={configColumns}
        onChangeColumns={handleChangeColumns}
        onSelectedSort={handleSelectedSort}
        onFullScreen={onFullScreen}
        config={config}
      />
      <TableContainer sx={{ position: "relative", overflow: "unset" }}>
        <Scrollbar sx={{ maxHeight: 720 }}>
          <Table stickyHeader size="medium" sx={{ minWidth: 960 }}>
            <TableHeadCustom
              headLabel={configColumns}
              numSelected={table.selected.length}
              rowCount={fixedAssets?.length || 0}
            />

            <TableBody>
              {loading ? (
                [...Array(5)].map((i, index) => <TableSkeleton key={index} sx={{ height: 60 }} />)
              ) : (
                <>
                  {fixedAssets.map((row) => (
                    <FixedAssetMaintenanceTableRow
                      workspaceId={workspaceId}
                      key={row.id}
                      row={row}
                      configColumns={configColumns}
                      selected={table.selected.includes(row.id as string)}
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
