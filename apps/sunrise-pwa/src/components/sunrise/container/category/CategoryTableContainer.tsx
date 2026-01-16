import { useState, useCallback } from "react";

import CategoryListTable from "../../core/category/CategoryListTable";
import { useDeleteCategory, useGetAllCategories } from "../../hook/useCategories";

type CategoryTableContainerProps = {
  workspaceId: string;
};
export default function CategoryTableContainer({ workspaceId }: CategoryTableContainerProps) {
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(50);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("updated_at:desc");

  const { data: categoriesData, isLoading } = useGetAllCategories(workspaceId, {
    search,
    limit,
    page,
    sort,
  });

  const deleteMutation = useDeleteCategory();

  const handleDeleteCategory = useCallback(
    (categoryId: string) => {
      deleteMutation.mutate(categoryId);
    },
    [deleteMutation]
  );

  return (
    <CategoryListTable
      workspaceId={workspaceId}
      categories={categoriesData?.data}
      pagination={categoriesData?.pagination}
      loading={isLoading}
      onDeleteRow={handleDeleteCategory}
      onSearch={setSearch}
      onLimitChange={(newLimit: number) => {
        setLimit(newLimit);
        setPage(1);
      }}
      onPageChange={setPage}
      onSortChange={setSort}
    />
  );
}
