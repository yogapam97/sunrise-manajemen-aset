import AppWidgetSummary from "../../core/dashboard/AppWidgetSummary";
import { useGetFixedAssetsReportTotalPurchaseCost } from "../../hook/useFixedAssets";

type DashboardTotalPurchaseCostWidgetContainerProps = {
  workpaceId: string;
};
export default function DashboardTotalPurchaseCostWidgetContainer({
  workpaceId,
}: DashboardTotalPurchaseCostWidgetContainerProps) {
  const { data, isLoading } = useGetFixedAssetsReportTotalPurchaseCost(workpaceId as string);
  return (
    <AppWidgetSummary
      title="Total Value"
      description="Sum of fixed asset purchase cost"
      loading={isLoading}
      total={data?.data}
    />
  );
}
