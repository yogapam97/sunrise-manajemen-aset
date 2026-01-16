// sections
import type { Metadata } from "next";

import MemberCreateView from "src/sections/member/member-create-view";

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: "Fixed Asset",
};
type PageProps = {
  params: {
    workspaceId: string;
  };
};
export default function Page({ params }: PageProps) {
  const { workspaceId } = params;

  return <MemberCreateView workspaceId={workspaceId} />;
}
