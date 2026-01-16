// sections
import type { Metadata } from "next";

import CategoryCreateView from "src/sections/category/category-create-view";

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: "Create | Category",
};
type PageProps = {
  params: {
    workspaceId: string;
  };
};
export default function Page({ params }: PageProps) {
  const { workspaceId } = params;
  return <CategoryCreateView workspaceId={workspaceId} />;
}
