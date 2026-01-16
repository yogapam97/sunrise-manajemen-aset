// sections
import type { Metadata } from "next";

import AssignmentCreateView from "src/sections/assignment/assignment-create-view";

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: "Create Assignment",
};
type PageProps = {
  params: {
    workspaceId: string;
  };
};
export default function Page({ params }: PageProps) {
  const { workspaceId } = params;
  return <AssignmentCreateView workspaceId={workspaceId} />;
}
