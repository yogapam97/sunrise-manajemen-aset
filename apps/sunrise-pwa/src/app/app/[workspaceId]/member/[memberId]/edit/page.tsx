// sections
import type { Metadata } from "next";

import MemberEditView from "src/sections/member/member-edit-view";

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: "Edit Member",
};
type PageProps = {
  params: {
    workspaceId: string;
    memberId: string;
  };
};
export default function Page({ params }: PageProps) {
  const { workspaceId, memberId } = params;
  return <MemberEditView workspaceId={workspaceId} memberId={memberId} />;
}
