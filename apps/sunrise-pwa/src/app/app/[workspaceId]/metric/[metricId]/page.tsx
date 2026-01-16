// sections
import type { Metadata } from "next";

import MetricDetailView from "src/sections/metric/metric-detail-view";

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: "Metric",
};
type PageProps = {
  params: {
    workspaceId: string;
    metricId: string;
  };
};
export default function Page({ params }: PageProps) {
  const { workspaceId, metricId } = params;
  return <MetricDetailView metricId={metricId} workspaceId={workspaceId} />;
}
