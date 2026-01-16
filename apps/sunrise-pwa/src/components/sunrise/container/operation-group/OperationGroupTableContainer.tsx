import { useState, useCallback } from "react";

import OperationGroupListTable from "../../core/operation-group/OperationGroupListTable";
import { useDeleteOperationGroup, useGetAllOperationGroups } from "../../hook/useOperationGroups";

type OperationGroupTableContainerProps = {
  workspaceId: string;
  filter?: any;
  config?: any;
  onFilter?: (values: any) => void;
};

export default function OperationGroupTableContainer({
  workspaceId,
  filter,
  config,
  onFilter,
}: OperationGroupTableContainerProps) {
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(50);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("created_at:desc");

  const { data: operationGroupsData, isLoading } = useGetAllOperationGroups(workspaceId, {
    filter,
    search,
    limit,
    page,
    sort,
  });

  const deleteMutation = useDeleteOperationGroup();

  const handleDeleteOperationGroup = useCallback(
    (operationGroupId: string) => {
      deleteMutation.mutate(operationGroupId);
    },
    [deleteMutation]
  );

  return (
    <OperationGroupListTable
      workspaceId={workspaceId}
      operationGroups={operationGroupsData?.data}
      pagination={operationGroupsData?.pagination}
      loading={isLoading}
      onDeleteRow={handleDeleteOperationGroup}
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
