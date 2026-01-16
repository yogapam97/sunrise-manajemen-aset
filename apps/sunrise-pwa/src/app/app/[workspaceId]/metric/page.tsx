// sections
import type { Metadata } from "next";

import MetricListView from "src/sections/metric/metric-list-view";

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: "Metric",
};
type PageProps = {
  params: {
    workspaceId: string;
  };
};
export default function Page({ params }: PageProps) {
  const { workspaceId } = params;
  return <MetricListView workspaceId={workspaceId} />;
}
