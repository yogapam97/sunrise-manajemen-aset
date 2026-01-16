import type { IMemberItem } from "src/types/member";
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

import MemberTableRow from "./MemberTableRow";
import MemberTableToolbar from "./MemberTableToolbar";
import { CREATE_NEWEST_ICON, CREATE_OLDEST_ICON, LATEST_UPDATE_ICON } from "../../icon-definitions";

const TABLE_HEAD = [
  {
    id: "",
    label: <Iconify icon="eva:more-vertical-fill" />,
    width: "1px",
    align: "center",
    alwaysShow: true,
  },
  { id: "name", label: "Member", alwaysShow: true },
  { id: "email", label: "Email", show: true },
  { id: "role", label: "Role", show: true },
  { id: "status", label: "Invitation Status", show: true },
];

const SORT_OPTIONS = [
  { value: "updated_at:desc", label: "Latest Update", icon: LATEST_UPDATE_ICON },
  { value: "created_at:desc", label: "Create Newest", icon: CREATE_NEWEST_ICON },
  { value: "created_at:asc", label: "Create Oldest", icon: CREATE_OLDEST_ICON },
];

type MemberListTableProps = {
  workspaceId: string;
  members: IMemberItem[];
  pagination: IPagination;
  loading: boolean;
  onDeleteRow: (id: string) => void;
  onLimitChange: (limit: number) => void;
  onPageChange: (page: number) => void;
  onSearch: (search: string) => void;
  onSortChange?: (sort: string) => void;
  onResendInvitation: (memberId: string) => void;
  onResetPassword: (memberId: string) => void;
};
export default function MemberListTable({
  workspaceId,
  members,
  loading,
  pagination,
  onDeleteRow,
  onLimitChange,
  onPageChange,
  onSearch,
  onSortChange,
  onResendInvitation,
  onResetPassword,
}: MemberListTableProps) {
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
      <MemberTableToolbar
        onSearch={onSearch}
        selectedSort={selectedSort}
        onSelectedSort={handleSelectedSort}
        sortOptions={SORT_OPTIONS}
      />
      <TableContainer sx={{ position: "relative", overflow: "unset" }}>
        <Scrollbar>
          <Table size="medium" sx={{ minWidth: 960 }}>
            <TableHeadCustom headLabel={TABLE_HEAD} rowCount={members?.length || 0} />

            <TableBody>
              {loading ? (
                [...Array(5)].map((i, index) => <TableSkeleton key={index} sx={{ height: 60 }} />)
              ) : (
                <>
                  {members.map((row) => (
                    <MemberTableRow
                      key={row.id}
                      row={row}
                      workspaceId={workspaceId}
                      onDeleteRow={() => onDeleteRow(row.id as string)}
                      onResendInvitation={(memberId) => onResendInvitation(memberId)}
                      onResetPassword={(memberId) => onResetPassword(memberId)}
                    />
                  ))}
                  {members.length < 40 && members.length > 0 && (
                    <TableEmptyRows height={10} emptyRows={50} />
                  )}

                  <TableNoData notFound={!members.length && !loading} />
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
          rowsPerPageOptions={members?.length > 50 ? [50, 100, 150, 200, 250] : []}
          dense
        />
      )}
    </Card>
  );
}
