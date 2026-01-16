import type { IPagination } from "src/types/pagination";
import type { IFixedAssetItem } from "src/types/fixed-asset";

import { useState } from "react";

import { Card, Table, TableBody, TableContainer } from "@mui/material";

import Iconify from "src/components/iconify";
import Scrollbar from "src/components/scrollbar";
import {
  useTable,
  TableNoData,
  TableSkeleton,
  TableEmptyRows,
  TableHeadCustom,
  TablePaginationCustom,
} from "src/components/table";

import FixedAssetTableRow from "./FixedAssetTableRow";
import FixedAssetTableToolbar from "./FixedAssetTableToolbar";
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
  { id: "location", label: "Location", show: true },
  { id: "assignee", label: "Assignee", show: true },
  { id: "serial_number", label: "Serial Number", show: false },
  { id: "type", label: "Type", show: false },
  { id: "description", label: "Description", show: false },
  { id: "purchase_cost", label: "Purchase Cost", show: false },
  { id: "purchase_date", label: "Purchase Date", show: false },
  { id: "lifecycle", label: "Lifecycle", show: true },
  { id: "category", label: "Category", show: true },
  { id: "supplier", label: "Supplier", show: true },
  { id: "warranty_expire_date", label: "Warranty Expire Date", show: false },
];

const SORT_OPTIONS = [
  { value: "updated_at:desc", label: "Latest Update", icon: LATEST_UPDATE_ICON },
  { value: "created_at:desc", label: "Create Newest", icon: CREATE_NEWEST_ICON },
  { value: "created_at:asc", label: "Create Oldest", icon: CREATE_OLDEST_ICON },
  { value: "name:asc", label: "Name A to Z", icon: ALPHA_ASC_ICON },
  { value: "name:desc", label: "Name Z to A", icon: ALPHA_DESC_ICON },
];

type FixedAssetListTableProps = {
  workspaceId: string;
  fixedAssets: IFixedAssetItem[];
  pagination: IPagination;
  loading: boolean;
  onDeleteRow: (id: string) => void;
  onSearch: (search: string) => void;
  onGenerateQr: (id: string[]) => void;
  onLimitChange: (limit: number) => void;
  onPageChange: (page: number) => void;
  config: { hideImport: boolean; hideFilter: boolean };
  onDownloadCSV: () => void;
  loadingDownloadCSV: boolean;
  onClickFilter: VoidFunction;
  onSortChange?: (sort: string) => void;
  onFullScreen: VoidFunction;
};
export default function FixedAssetListTable({
  workspaceId,
  fixedAssets,
  loading,
  pagination,
  onDeleteRow,
  onSearch,
  onGenerateQr,
  onLimitChange,
  onPageChange,
  onDownloadCSV,
  loadingDownloadCSV,
  config,
  onClickFilter,
  onSortChange,
  onFullScreen,
}: FixedAssetListTableProps) {
  const table = useTable();
  const [configColumns, setConfigColumns] = useState<any[]>(TABLE_HEAD);
  const [selectedSort, setSelectedSort] = useState(SORT_OPTIONS[0]?.value || "");

  const handleLimitChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onLimitChange(parseInt(event.target.value, 10));
  };

  const handlePageChange = (event: unknown, newPage: number) => {
    onPageChange(newPage + 1);
  };

  const handleGenerateQr = (id: string) => {
    onGenerateQr([id]);
  };

  const handleGenerateQrs = () => {
    onGenerateQr(table.selected);
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
      <FixedAssetTableToolbar
        sortOptions={SORT_OPTIONS}
        selectedSort={selectedSort}
        onClickFilter={onClickFilter}
        hideImport={config?.hideImport}
        hideFilter={config?.hideFilter}
        onSearch={onSearch}
        selectedItems={table.selected}
        onGenerateQr={handleGenerateQrs}
        onDownloadCSV={onDownloadCSV}
        loadingDownloadCSV={loadingDownloadCSV}
        workspaceId={workspaceId}
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
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  fixedAssets.map((row) => row.id || "")
                )
              }
            />

            <TableBody>
              {loading ? (
                [...Array(5)].map((i, index) => <TableSkeleton key={index} sx={{ height: 60 }} />)
              ) : (
                <>
                  {fixedAssets.map((row) => (
                    <FixedAssetTableRow
                      workspaceId={workspaceId}
                      key={row.id}
                      row={row}
                      configColumns={configColumns}
                      selected={table.selected.includes(row.id as string)}
                      onSelectRow={() => table.onSelectRow(row.id as string)}
                      onDeleteRow={() => onDeleteRow(row.id as string)}
                      onGenerateQr={() => handleGenerateQr(row.id as string)}
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
