// sections
import type { Metadata } from "next";

import OperationGroupListView from "src/sections/operation-group/operation-group-list-view";

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: "Operation Group",
};
type PageProps = {
  params: {
    workspaceId: string;
  };
};
export default function Page({ params }: PageProps) {
  const { workspaceId } = params;
  return <OperationGroupListView workspaceId={workspaceId} />;
}
