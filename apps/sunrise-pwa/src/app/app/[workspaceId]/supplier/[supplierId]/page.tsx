// sections
import type { Metadata } from "next";

import SupplierDetailView from "src/sections/supplier/supplier-detail-view";

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: "Supplier",
};
type PageProps = {
  params: {
    workspaceId: string;
    supplierId: string;
  };
};
export default function Page({ params }: PageProps) {
  const { workspaceId, supplierId } = params;
  return <SupplierDetailView supplierId={supplierId} workspaceId={workspaceId} />;
}
