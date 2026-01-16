// sections
import type { Metadata } from "next";

import WorkspaceCreateView from "src/sections/workspace/workspace-create/workspace-create-view";

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: "Workspace",
};

export default function Page() {
  return <WorkspaceCreateView />;
}
