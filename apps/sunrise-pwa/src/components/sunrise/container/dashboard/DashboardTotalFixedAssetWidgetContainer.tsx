import AppWidgetSummary from "../../core/dashboard/AppWidgetSummary";
import { useGetAllFixedAssetsReportCount } from "../../hook/useFixedAssets";

type DashboardTotalFixedAssetWidgetContainerProps = {
  workpaceId: string;
};
export default function DashboardTotalFixedAssetWidgetContainer({
  workpaceId,
}: DashboardTotalFixedAssetWidgetContainerProps) {
  const { data, isLoading } = useGetAllFixedAssetsReportCount(workpaceId as string);
  return (
    <AppWidgetSummary
      title="Total Fixed Asset"
      loading={isLoading}
      description="Number of registered fixed asset"
      total={data?.data}
    />
  );
}
