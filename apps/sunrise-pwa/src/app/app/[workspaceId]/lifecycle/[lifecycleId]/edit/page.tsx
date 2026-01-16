// sections
import type { Metadata } from "next";

import LifecycleEditView from "src/sections/lifecycle/lifecycle-edit-view";

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: "Edit Lifecycle",
};
type PageProps = {
  params: {
    workspaceId: string;
    lifecycleId: string;
  };
};
export default function Page({ params }: PageProps) {
  const { lifecycleId } = params;
  return <LifecycleEditView lifecycleId={lifecycleId} />;
}
