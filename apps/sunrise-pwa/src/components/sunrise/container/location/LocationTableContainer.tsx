import { useState, useCallback } from "react";

import LocationListTable from "../../core/location/LocationListTable";
import { useDeleteLocation, useGetAllLocations } from "../../hook/useLocations";

type LocationTableContainerProps = {
  workspaceId: string;
};
export default function LocationTableContainer({ workspaceId }: LocationTableContainerProps) {
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(50);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("updated_at:desc");

  const { data: locationsData, isLoading } = useGetAllLocations(workspaceId, {
    search,
    limit,
    page,
    sort,
  });

  const deleteMutation = useDeleteLocation();

  const handleDeleteLocation = useCallback(
    (locationId: string) => {
      deleteMutation.mutate(locationId);
    },
    [deleteMutation]
  );

  return (
    <LocationListTable
      workspaceId={workspaceId}
      locations={locationsData?.data}
      pagination={locationsData?.pagination}
      loading={isLoading}
      onDeleteRow={handleDeleteLocation}
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
