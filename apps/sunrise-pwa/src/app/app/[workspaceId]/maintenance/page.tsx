// sections
import type { Metadata } from "next";

import MaintenanceListView from "src/sections/maintenance/maintenance-list-view";

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: "Maintenance",
};
type PageProps = {
  params: {
    workspaceId: string;
  };
};
export default function Page({ params }: PageProps) {
  const { workspaceId } = params;
  return <MaintenanceListView workspaceId={workspaceId} />;
}
