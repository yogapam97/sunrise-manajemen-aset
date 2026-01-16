// sections
import DashboardView from "src/sections/dashboard/dashboard-view";

// ----------------------------------------------------------------------

export const metadata = {
  title: "Dashboard",
};
type PageProps = {
  params: {
    workspaceId: string;
  };
};
export default function OverviewAppPage({ params }: PageProps) {
  const { workspaceId } = params;

  return <DashboardView workspaceId={workspaceId} />;
}
