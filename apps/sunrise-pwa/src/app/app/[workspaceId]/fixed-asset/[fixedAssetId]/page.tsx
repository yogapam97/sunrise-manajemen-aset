// sections
import type { Metadata } from "next";

import FixedAssetDetailView from "src/sections/fixed-asset/fixed-asset-detail-view";

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: "Fixed Asset",
};
type PageProps = {
  params: {
    workspaceId: string;
    fixedAssetId: string;
  };
};
export default function Page({ params }: PageProps) {
  const { workspaceId, fixedAssetId } = params;
  return <FixedAssetDetailView workspaceId={workspaceId} fixedAssetId={fixedAssetId} />;
}
