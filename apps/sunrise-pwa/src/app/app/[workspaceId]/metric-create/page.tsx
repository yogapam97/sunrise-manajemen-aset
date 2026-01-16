// sections
import type { Metadata } from "next";

import MetricCreateView from "src/sections/metric/metric-create-view";

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
  return <MetricCreateView workspaceId={workspaceId} />;
}
