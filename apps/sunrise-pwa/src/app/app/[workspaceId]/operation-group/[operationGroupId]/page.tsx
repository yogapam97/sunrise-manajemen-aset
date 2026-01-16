// sections
import type { Metadata } from "next";

import OperationGroupDetailView from "src/sections/operation-group/operation-group-detail-view";

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: "Operation Group",
};
type PageProps = {
  params: {
    workspaceId: string;
    operationGroupId: string;
  };
};
export default function Page({ params }: PageProps) {
  const { workspaceId, operationGroupId } = params;
  return <OperationGroupDetailView operationGroupId={operationGroupId} workspaceId={workspaceId} />;
}
