// sections
import type { Metadata } from "next";

import RelocationListView from "src/sections/relocation/relocation-list-view";

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: "Relocation",
};
type PageProps = {
  params: {
    workspaceId: string;
  };
};
export default function Page({ params }: PageProps) {
  const { workspaceId } = params;
  return <RelocationListView workspaceId={workspaceId} />;
}
