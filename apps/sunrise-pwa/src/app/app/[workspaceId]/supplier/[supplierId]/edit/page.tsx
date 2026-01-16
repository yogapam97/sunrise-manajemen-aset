// sections
import type { Metadata } from "next";

import SupplierEditView from "src/sections/supplier/supplier-edit-view";

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: "Edit Supplier",
};
type PageProps = {
  params: {
    workspaceId: string;
    supplierId: string;
  };
};
export default function Page({ params }: PageProps) {
  const { supplierId } = params;
  return <SupplierEditView supplierId={supplierId} />;
}
