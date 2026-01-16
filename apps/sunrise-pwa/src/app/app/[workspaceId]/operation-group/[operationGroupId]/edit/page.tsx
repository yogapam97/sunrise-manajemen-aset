// sections
import type { Metadata } from "next";

import OperationGroupEditView from "src/sections/operation-group/operation-group-edit-view";

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: "Edit Operation Group",
};
type PageProps = {
  params: {
    workspaceId: string;
    operationGroupId: string;
  };
};
export default function Page({ params }: PageProps) {
  const { workspaceId, operationGroupId } = params;
  return <OperationGroupEditView workspaceId={workspaceId} operationGroupId={operationGroupId} />;
}
