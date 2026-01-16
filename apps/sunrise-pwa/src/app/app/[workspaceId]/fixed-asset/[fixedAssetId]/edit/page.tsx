// sections
import type { Metadata } from "next";

import FixedAssetEditView from "src/sections/fixed-asset/fixed-asset-edit-view";

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: "Edit Fixed Asset",
};
type PageProps = {
  params: {
    workspaceId: string;
    fixedAssetId: string;
  };
};
export default function Page({ params }: PageProps) {
  const { workspaceId, fixedAssetId } = params;
  return <FixedAssetEditView workspaceId={workspaceId} fixedAssetId={fixedAssetId} />;
}
