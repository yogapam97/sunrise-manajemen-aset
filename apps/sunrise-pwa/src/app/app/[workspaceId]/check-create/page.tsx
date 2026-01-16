// sections
import type { Metadata } from "next";

import CheckCreateView from "src/sections/check/check-create-view";

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: "Create Check In/Out",
};
type PageProps = {
  params: {
    workspaceId: string;
  };
};
export default function Page({ params }: PageProps) {
  const { workspaceId } = params;
  return <CheckCreateView workspaceId={workspaceId} />;
}
