import AppWidgetSummary from "../../core/dashboard/AppWidgetSummary";
import { useGetFixedAssetsReportTotalDepreciation } from "../../hook/useFixedAssets";

type DashboardTotalDepreciationWidgetContainerProps = {
  workpaceId: string;
};
export default function DashboardTotalDepreciationWidgetContainer({
  workpaceId,
}: DashboardTotalDepreciationWidgetContainerProps) {
  const { data, isLoading } = useGetFixedAssetsReportTotalDepreciation(workpaceId as string);
  return (
    <AppWidgetSummary
      title="Total Book Value"
      description="Sum of book value after depreciation"
      loading={isLoading}
      total={data?.data?.total_current_purchase_cost}
      percent={data?.data?.depreciation_percentage}
    />
  );
}
