// sections
import type { Metadata } from "next";

import MemberListView from "src/sections/member/member-list-view";

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: "Member",
};
type PageProps = {
  params: {
    workspaceId: string;
  };
};
export default function Page({ params }: PageProps) {
  const { workspaceId } = params;
  return <MemberListView workspaceId={workspaceId} />;
}
