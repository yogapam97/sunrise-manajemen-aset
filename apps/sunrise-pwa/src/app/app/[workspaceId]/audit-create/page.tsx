// sections
import type { Metadata } from "next";

import AuditCreateView from "src/sections/audit/audit-create-view";

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: "Create Audit",
};
type PageProps = {
  params: {
    workspaceId: string;
  };
};
export default function Page({ params }: PageProps) {
  const { workspaceId } = params;
  return <AuditCreateView workspaceId={workspaceId} />;
}
