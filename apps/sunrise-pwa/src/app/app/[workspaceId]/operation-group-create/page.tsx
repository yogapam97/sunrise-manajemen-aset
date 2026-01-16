// sections
import type { Metadata } from "next";

import OperationGroupCreateView from "src/sections/operation-group/operation-group-create-view";

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: "Create Operation Group",
};
type PageProps = {
  params: {
    workspaceId: string;
  };
};
export default function Page({ params }: PageProps) {
  const { workspaceId } = params;
  return <OperationGroupCreateView workspaceId={workspaceId} />;
}
