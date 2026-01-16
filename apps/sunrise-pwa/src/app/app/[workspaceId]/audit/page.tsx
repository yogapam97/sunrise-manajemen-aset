// sections
import type { Metadata } from "next";

import AuditListView from "src/sections/audit/audit-list-view";

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: "Audit",
};
type PageProps = {
  params: {
    workspaceId: string;
  };
};
export default function Page({ params }: PageProps) {
  const { workspaceId } = params;
  return <AuditListView workspaceId={workspaceId} />;
}
