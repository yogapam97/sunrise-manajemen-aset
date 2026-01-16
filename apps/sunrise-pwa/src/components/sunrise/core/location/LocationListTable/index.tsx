import type { ILocationItem } from "src/types/location";
import type { IPagination } from "src/types/pagination";

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

import LocationTableRow from "./LocationTableRow";
import LocationTableToolbar from "./LocationTableToolbar";
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
  { id: "name", label: "Location", alwaysShow: true },
  { id: "address", label: "Address", show: true },
];

const SORT_OPTIONS = [
  { value: "updated_at:desc", label: "Latest Update", icon: LATEST_UPDATE_ICON },
  { value: "created_at:desc", label: "Create Newest", icon: CREATE_NEWEST_ICON },
  { value: "created_at:asc", label: "Create Oldest", icon: CREATE_OLDEST_ICON },
  { value: "name:asc", label: "Name A to Z", icon: ALPHA_ASC_ICON },
  { value: "name:desc", label: "Name Z to A", icon: ALPHA_DESC_ICON },
];

type LocationListTableProps = {
  workspaceId: string;
  locations: ILocationItem[];
  pagination: IPagination;
  loading: boolean;
  onDeleteRow: (id: string) => void;
  onSearch: (search: string) => void;
  onLimitChange: (limit: number) => void;
  onPageChange: (page: number) => void;
  onSortChange?: (sort: string) => void;
};
export default function LocationListTable({
  workspaceId,
  locations,
  loading,
  pagination,
  onDeleteRow,
  onSearch,
  onPageChange,
  onLimitChange,
  onSortChange,
}: LocationListTableProps) {
  const [selectedSort, setSelectedSort] = useState(SORT_OPTIONS[0]?.value);

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
      <LocationTableToolbar
        onSearch={onSearch}
        selectedSort={selectedSort}
        sortOptions={SORT_OPTIONS}
        onSelectedSort={handleSelectedSort}
      />
      <TableContainer sx={{ position: "relative", overflow: "unset" }}>
        <Scrollbar>
          <Table size="medium" sx={{ minWidth: 960 }}>
            <TableHeadCustom headLabel={TABLE_HEAD} rowCount={locations?.length || 0} />

            <TableBody>
              {loading ? (
                [...Array(5)].map((i, index) => <TableSkeleton key={index} sx={{ height: 60 }} />)
              ) : (
                <>
                  {locations.map((row) => (
                    <LocationTableRow
                      workspaceId={workspaceId}
                      key={row.id}
                      row={row}
                      onDeleteRow={() => onDeleteRow(row.id as string)}
                    />
                  ))}

                  {locations.length < 40 && locations.length > 0 && (
                    <TableEmptyRows height={10} emptyRows={50} />
                  )}

                  <TableNoData notFound={!locations.length && !loading} />
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
          rowsPerPageOptions={locations?.length > 50 ? [50, 100, 150, 200, 250] : []}
          dense
        />
      )}
    </Card>
  );
}
