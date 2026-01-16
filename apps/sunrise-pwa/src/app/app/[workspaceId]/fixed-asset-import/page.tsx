// sections
import type { Metadata } from "next";

import FixedAssetImportView from "src/sections/fixed-asset/fixed-asset-import-view";

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: "Fixed Asset Import",
};
type PageProps = {
  params: {
    workspaceId: string;
  };
};
export default function Page({ params }: PageProps) {
  const { workspaceId } = params;
  return <FixedAssetImportView workspaceId={workspaceId} />;
}
