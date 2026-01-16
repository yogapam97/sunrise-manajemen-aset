// sections
import type { Metadata } from "next";

import TransitionCreateView from "src/sections/transition/transition-create-view";

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: "Create Transition",
};
type PageProps = {
  params: {
    workspaceId: string;
  };
};
export default function Page({ params }: PageProps) {
  const { workspaceId } = params;
  return <TransitionCreateView workspaceId={workspaceId} />;
}
