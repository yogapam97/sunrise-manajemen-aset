import { useState } from "react";

import { useGetAllAssignments } from "../../hook/useAssignments";
import AssignmentListTable from "../../core/assignment/AssignmentListTable";

type AssignmentTableContainerProps = {
  workspaceId: string;
};
export default function AssignmentTableContainer({ workspaceId }: AssignmentTableContainerProps) {
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(50);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("updated_at:desc");

  const { data: assignmentsData, isLoading } = useGetAllAssignments(workspaceId, {
    search,
    limit,
    page,
    sort,
  });

  return (
    <AssignmentListTable
      workspaceId={workspaceId}
      assignments={assignmentsData?.data}
      pagination={assignmentsData?.pagination}
      loading={isLoading}
      onSearch={setSearch}
      onLimitChange={(newLimit: number) => {
        setLimit(newLimit);
        setPage(1);
      }}
      onPageChange={setPage}
      onSortChange={setSort}
    />
  );
}
