// sections
import type { Metadata } from "next";

import FixedAssetCreateView from "src/sections/fixed-asset/fixed-asset-create-view";

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

  return <FixedAssetCreateView workspaceId={workspaceId} />;
}
