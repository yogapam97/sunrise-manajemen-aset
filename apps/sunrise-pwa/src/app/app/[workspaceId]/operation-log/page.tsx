// sections
import type { Metadata } from "next";

import OperationLogListView from "src/sections/operation-log/operation-log-list-view";

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: "Operation Log",
};
type PageProps = {
  params: {
    workspaceId: string;
  };
};
export default function Page({ params }: PageProps) {
  const { workspaceId } = params;
  return <OperationLogListView workspaceId={workspaceId} />;
}
