// sections
import type { Metadata } from "next";

import WorkspaceEditView from "src/sections/workspace/workspace-edit/workspace-edit-view";

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: "Edit Workspace",
};
type PageProps = {
  params: {
    workspaceId: string;
  };
};
export default function Page({ params }: PageProps) {
  const { workspaceId } = params;
  return <WorkspaceEditView workspaceId={workspaceId} />;
}
