// sections
import type { Metadata } from "next";

import WorkspaceJoinView from "src/sections/workspace/workspace-join/workspace-join-view";

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: "Join Workspace",
};
type PageProps = {
  params: {
    workspaceId: string;
  };
};
export default function Page({ params }: PageProps) {
  const { workspaceId } = params;
  return <WorkspaceJoinView workspaceId={workspaceId} />;
}
