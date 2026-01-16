// sections
import type { Metadata } from "next";

import DepreciationListView from "src/sections/depreciation/depreciation-list-view";

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: "Depreciation",
};
type PageProps = {
  params: {
    workspaceId: string;
  };
};
export default function Page({ params }: PageProps) {
  const { workspaceId } = params;
  return <DepreciationListView workspaceId={workspaceId} />;
}
