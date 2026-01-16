// sections
import type { Metadata } from "next";

import SupplierCreateView from "src/sections/supplier/supplier-create-view";

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
  return <SupplierCreateView workspaceId={workspaceId} />;
}
