import { useState, useCallback } from "react";

import SupplierListTable from "../../core/supplier/SupplierListTable";
import { useDeleteSupplier, useGetAllSuppliers } from "../../hook/useSuppliers";

type SupplierTableContainerProps = {
  workspaceId: string;
};
export default function SupplierTableContainer({ workspaceId }: SupplierTableContainerProps) {
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(50);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("updated_at:desc");

  const { data: suppliersData, isLoading } = useGetAllSuppliers(workspaceId, {
    search,
    limit,
    page,
    sort,
  });

  const deleteMutation = useDeleteSupplier();

  const handleDeleteSupplier = useCallback(
    (supplierId: string) => {
      deleteMutation.mutate(supplierId);
    },
    [deleteMutation]
  );

  return (
    <SupplierListTable
      workspaceId={workspaceId}
      suppliers={suppliersData?.data}
      pagination={suppliersData?.pagination}
      loading={isLoading}
      onDeleteRow={handleDeleteSupplier}
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
