// sections
import type { Metadata } from "next";

import CategoryEditView from "src/sections/category/category-edit-view";

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: "Edit Category",
};
type PageProps = {
  params: {
    workspaceId: string;
    categoryId: string;
  };
};
export default function Page({ params }: PageProps) {
  const { categoryId } = params;
  return <CategoryEditView categoryId={categoryId} />;
}
