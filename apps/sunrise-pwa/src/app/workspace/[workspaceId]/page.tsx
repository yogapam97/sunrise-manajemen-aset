// sections
import type { Metadata } from "next";

import WorkspaceDetailView from "src/sections/workspace/workspace-detail/workspace-detail-view";

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: "Workspace",
};
type PageProps = {
  params: {
    workspaceId: string;
  };
};
export default function Page({ params }: PageProps) {
  const { workspaceId } = params;
  return <WorkspaceDetailView workspaceId={workspaceId} />;
}
