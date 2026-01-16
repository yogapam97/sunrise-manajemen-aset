// sections
import type { Metadata } from "next";

import MetricEditView from "src/sections/metric/metric-edit-view";

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: "Edit Metric",
};
type PageProps = {
  params: {
    workspaceId: string;
    metricId: string;
  };
};
export default function Page({ params }: PageProps) {
  const { workspaceId, metricId } = params;
  return <MetricEditView workspaceId={workspaceId} metricId={metricId} />;
}
