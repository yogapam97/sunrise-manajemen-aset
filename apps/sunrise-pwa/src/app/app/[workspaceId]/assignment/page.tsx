// sections
import type { Metadata } from "next";

import AssignmentListView from "src/sections/assignment/assignment-list-view";

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: "Assignment",
};
type PageProps = {
  params: {
    workspaceId: string;
  };
};
export default function Page({ params }: PageProps) {
  const { workspaceId } = params;
  return <AssignmentListView workspaceId={workspaceId} />;
}
