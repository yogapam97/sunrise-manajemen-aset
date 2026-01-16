// sections
import type { Metadata } from "next";

import CategoryListView from "src/sections/category/category-list-view";

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: "Category",
};
type PageProps = {
  params: {
    workspaceId: string;
  };
};
export default function Page({ params }: PageProps) {
  const { workspaceId } = params;
  return <CategoryListView workspaceId={workspaceId} />;
}
