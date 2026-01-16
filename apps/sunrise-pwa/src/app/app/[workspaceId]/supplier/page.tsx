// sections
import type { Metadata } from "next";

import SupplierListView from "src/sections/supplier/supplier-list-view";

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: "Supplier",
};
type PageProps = {
  params: {
    workspaceId: string;
  };
};
export default function Page({ params }: PageProps) {
  const { workspaceId } = params;
  return <SupplierListView workspaceId={workspaceId} />;
}
