// sections
import type { Metadata } from "next";

import MemberDetailView from "src/sections/member/member-detail-view";

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: "Member",
};
type PageProps = {
  params: {
    workspaceId: string;
    memberId: string;
  };
};
export default function Page({ params }: PageProps) {
  const { workspaceId, memberId } = params;
  return <MemberDetailView workspaceId={workspaceId} memberId={memberId} />;
}
