// sections
import type { Metadata } from "next";

import CategoryDetailView from "src/sections/category/category-detail-view";

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: "Category",
};
type PageProps = {
  params: {
    workspaceId: string;
    categoryId: string;
  };
};
export default function Page({ params }: PageProps) {
  const { workspaceId, categoryId } = params;
  return <CategoryDetailView categoryId={categoryId} workspaceId={workspaceId} />;
}
