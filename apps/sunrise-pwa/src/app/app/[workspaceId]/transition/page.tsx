// sections
import type { Metadata } from "next";

import TransitionListView from "src/sections/transition/transition-list-view";

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: "Transition",
};
type PageProps = {
  params: {
    workspaceId: string;
  };
};
export default function Page({ params }: PageProps) {
  const { workspaceId } = params;
  return <TransitionListView workspaceId={workspaceId} />;
}
