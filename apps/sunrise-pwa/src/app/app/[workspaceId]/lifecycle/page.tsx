// sections
import type { Metadata } from "next";

import LifecycleListView from "src/sections/lifecycle/lifecycle-list-view";

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: "Lifecycle",
};
type PageProps = {
  params: {
    workspaceId: string;
  };
};
export default function Page({ params }: PageProps) {
  const { workspaceId } = params;
  return <LifecycleListView workspaceId={workspaceId} />;
}
