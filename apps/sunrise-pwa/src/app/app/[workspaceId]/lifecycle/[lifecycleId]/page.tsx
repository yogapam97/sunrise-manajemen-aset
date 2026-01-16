// sections
import type { Metadata } from "next";

import LifecycleDetailView from "src/sections/lifecycle/lifecycle-detail-view";

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: "Lifecycle",
};
type PageProps = {
  params: {
    workspaceId: string;
    lifecycleId: string;
  };
};
export default function Page({ params }: PageProps) {
  const { lifecycleId, workspaceId } = params;
  return <LifecycleDetailView lifecycleId={lifecycleId} workspaceId={workspaceId} />;
}
