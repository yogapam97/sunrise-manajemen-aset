// sections
import type { Metadata } from "next";

import WorkspaceListView from "src/sections/workspace/workspace-list/workspace-list-view";

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: "Workspace",
};

export default function Page() {
  return <WorkspaceListView />;
}
