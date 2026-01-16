// sections
import type { Metadata } from "next";

import CheckListView from "src/sections/check/check-list-view";

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: "Check In/Out",
};
type PageProps = {
  params: {
    workspaceId: string;
  };
};
export default function Page({ params }: PageProps) {
  const { workspaceId } = params;
  return <CheckListView workspaceId={workspaceId} />;
}
