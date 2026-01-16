// sections
import type { Metadata } from "next";

import MaintenanceCreateView from "src/sections/maintenance/maintenance-create-view";

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: "Create Maintenance",
};
type PageProps = {
  params: {
    workspaceId: string;
  };
};
export default function Page({ params }: PageProps) {
  const { workspaceId } = params;
  return <MaintenanceCreateView workspaceId={workspaceId} />;
}
