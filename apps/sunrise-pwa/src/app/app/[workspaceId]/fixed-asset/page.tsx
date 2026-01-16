// sections
import type { Metadata } from "next";

import FixedAssetListView from "src/sections/fixed-asset/fixed-asset-list-view";

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
  return <FixedAssetListView workspaceId={workspaceId} />;
}
