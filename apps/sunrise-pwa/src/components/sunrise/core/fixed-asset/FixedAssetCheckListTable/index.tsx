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

import FixedAssetCheckTableRow from "./FixedAssetCheckTableRow";
import FixedAssetCheckTableToolbar from "./FixedAssetCheckTableToolbar";
import {
  ALPHA_ASC_ICON,
  ALPHA_DESC_ICON,
  CREATE_NEWEST_ICON,
  CREATE_OLDEST_ICON,
  LATEST_UPDATE_ICON,
} from "../../icon-definitions";

const TABLE_HEAD = [
  { id: "check_due_date", label: "Expire Date", show: true },
  { id: "name", label: "Fixed Asset", alwaysShow: true },
  { id: "current_check", label: "Current Status", show: true },
  { id: "action", label: "Action", show: true },
  { id: "assignee", label: "Current Assignee", show: true },
  { id: "location", label: "Current Location", show: true },
  { id: "in_out_date", label: "In/Out Date", show: true },
  { id: "note", label: "Note", show: true },
  { id: "checked_by", label: "Checked By", show: true },
];

const SORT_OPTIONS = [
  { value: "updated_at:desc", label: "Latest Update", icon: LATEST_UPDATE_ICON },
  { value: "check_expiration_date:asc", label: "Expire Date Nearest", icon: CREATE_NEWEST_ICON },
  { value: "check_expiration_date:desc", label: "Expire Date Latest", icon: CREATE_OLDEST_ICON },
  { value: "name:asc", label: "Name A to Z", icon: ALPHA_ASC_ICON },
  { value: "name:desc", label: "Name Z to A", icon: ALPHA_DESC_ICON },
];

type FixedAssetCheckListTableProps = {
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
export default function FixedAssetCheckListTable({
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
}: FixedAssetCheckListTableProps) {
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
      <FixedAssetCheckTableToolbar
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
                    <FixedAssetCheckTableRow
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
