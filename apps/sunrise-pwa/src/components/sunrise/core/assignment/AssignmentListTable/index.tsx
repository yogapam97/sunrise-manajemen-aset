import type { IPagination } from "src/types/pagination";
import type { IAssignmentItem } from "src/types/assignment";

import { useState } from "react";

import { Card, Table, TableBody, TableContainer } from "@mui/material";

import Scrollbar from "src/components/scrollbar";
import {
  TableNoData,
  TableSkeleton,
  TableEmptyRows,
  TableHeadCustom,
  TablePaginationCustom,
} from "src/components/table";

import AssignmentTableRow from "./AssignmentTableRow";
import AssignmentTableToolbar from "./AssignmentTableToolbar";

const TABLE_HEAD = [
  { id: "created_at", label: "Date Time", alwaysShow: true },
  { id: "fixed_asset", label: "Fixed Asset", alwaysShow: true },
  { id: "assignment", label: "Assignment", show: true },
  { id: "note", label: "Note", show: true },
  { id: "assigned_by", label: "Assigned By", show: true },
];

const SORT_OPTIONS = [
  { value: "updated_at:desc", label: "Latest Update" },
  { value: "created_at:desc", label: "Create Newest" },
  { value: "created_at:asc", label: "Create Oldest" },
];

type AssignmentListTableProps = {
  workspaceId: string;
  assignments: IAssignmentItem[];
  pagination: IPagination;
  loading: boolean;
  onSearch: (search: string) => void;
  onLimitChange: (limit: number) => void;
  onPageChange: (page: number) => void;
  onSortChange?: (sort: string) => void;
};
export default function AssignmentListTable({
  workspaceId,
  assignments,
  loading,
  pagination,
  onSearch,
  onPageChange,
  onLimitChange,
  onSortChange,
}: AssignmentListTableProps) {
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

  return (
    <Card>
      <AssignmentTableToolbar
        onSearch={onSearch}
        selectedSort={selectedSort}
        onSelectedSort={handleSelectedSort}
        sortOptions={SORT_OPTIONS}
      />
      <TableContainer sx={{ position: "relative", overflow: "unset" }}>
        <Scrollbar>
          <Table size="medium" sx={{ minWidth: 960 }}>
            <TableHeadCustom headLabel={TABLE_HEAD} rowCount={assignments?.length || 0} />

            <TableBody>
              {loading ? (
                [...Array(5)].map((i, index) => <TableSkeleton key={index} sx={{ height: 60 }} />)
              ) : (
                <>
                  {assignments.map((row) => (
                    <AssignmentTableRow workspaceId={workspaceId} key={row.id} row={row} />
                  ))}
                  {assignments.length < 40 && assignments.length > 0 && (
                    <TableEmptyRows height={10} emptyRows={50} />
                  )}

                  <TableNoData notFound={!assignments.length && !loading} />
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
          rowsPerPageOptions={assignments?.length > 50 ? [50, 100, 150, 200, 250] : []}
          dense
        />
      )}
    </Card>
  );
}
