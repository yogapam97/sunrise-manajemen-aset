// sections
import type { Metadata } from "next";

import OperationGroupDoView from "src/sections/operation-group/operation-group-do-view";

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: "Do Operation Group",
};
type PageProps = {
  params: {
    workspaceId: string;
    operationGroupId: string;
  };
};
export default function Page({ params }: PageProps) {
  const { workspaceId, operationGroupId } = params;
  return <OperationGroupDoView workspaceId={workspaceId} operationGroupId={operationGroupId} />;
}
