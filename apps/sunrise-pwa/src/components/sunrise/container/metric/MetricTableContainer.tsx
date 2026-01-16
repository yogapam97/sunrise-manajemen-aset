import { useState, useCallback } from "react";

import MetricListTable from "../../core/metric/MetricListTable";
import { useDeleteMetric, useGetAllMetrics } from "../../hook/useMetrics";

type MetricTableContainerProps = {
  workspaceId: string;
};
export default function MetricTableContainer({ workspaceId }: MetricTableContainerProps) {
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(50);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("updated_at:desc");

  const { data: metricsData, isLoading } = useGetAllMetrics(workspaceId, {
    search,
    limit,
    page,
    sort,
  });

  const deleteMutation = useDeleteMetric();

  const handleDeleteMetric = useCallback(
    (metricId: string) => {
      deleteMutation.mutate(metricId);
    },
    [deleteMutation]
  );

  return (
    <MetricListTable
      workspaceId={workspaceId}
      metrics={metricsData?.data}
      pagination={metricsData?.pagination}
      loading={isLoading}
      onDeleteRow={handleDeleteMetric}
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
