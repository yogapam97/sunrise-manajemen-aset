// sections
import type { Metadata } from "next";

import RelocationCreateView from "src/sections/relocation/relocation-create-view";

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: "Create Relocation",
};
type PageProps = {
  params: {
    workspaceId: string;
  };
};
export default function Page({ params }: PageProps) {
  const { workspaceId } = params;
  return <RelocationCreateView workspaceId={workspaceId} />;
}
