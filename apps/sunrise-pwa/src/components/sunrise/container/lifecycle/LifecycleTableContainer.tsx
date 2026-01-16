import { useState, useCallback } from "react";

import LifecycleListTable from "../../core/lifecycle/LifecycleListTable";
import { useDeleteLifecycle, useGetAllLifecycles } from "../../hook/useLifecycles";

type LifecycleTableContainerProps = {
  workspaceId: string;
};
export default function LifecycleTableContainer({ workspaceId }: LifecycleTableContainerProps) {
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(50);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("updated_at:desc");

  const { data: lifecyclesData, isLoading } = useGetAllLifecycles(workspaceId, {
    search,
    limit,
    page,
    sort,
  });

  const deleteMutation = useDeleteLifecycle();

  const handleDeleteLifecycle = useCallback(
    (lifecycleId: string) => {
      deleteMutation.mutate(lifecycleId);
    },
    [deleteMutation]
  );

  return (
    <LifecycleListTable
      workspaceId={workspaceId}
      lifecycles={lifecyclesData?.data}
      pagination={lifecyclesData?.pagination}
      loading={isLoading}
      onDeleteRow={handleDeleteLifecycle}
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
