import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

import { Stack } from "@mui/material";

import { useBoolean } from "src/hooks/use-boolean";

import CommonDialog from "../../core/common/CommonDialog";
import { useGetAllFixedAssets } from "../../hook/useFixedAssets";
import CommonAutocompleteInputTag from "../../core/common/CommonAutocompleteInputTag";
import FixedAssetMaintenanceListTable from "../../core/fixed-asset/FixedAssetMaintenanceListTable";
import FixedAssetMaintenanceFilterForm from "../../core/fixed-asset/FixedAssetMaintenanceFilterForm";

type FixedAssetMaintenanceTableContainerProps = {
  workspaceId: string;
  filter?: any;
  config?: any;
  onFilter?: (values: any) => void;
  onFullScreen: VoidFunction;
};

export default function FixedAssetMaintenanceTableContainer({
  workspaceId,
  filter,
  config,
  onFilter,
  onFullScreen,
}: FixedAssetMaintenanceTableContainerProps) {
  const [sort, setSort] = useState<string>("maintenance_next_date:asc");
  const filterFixedAsset = useBoolean();
  const searchParams = useSearchParams();
  const tags = searchParams.getAll("tags[]") || [];
  const [defaultTags, setDefaultTags] = useState<string[]>(tags);
  type MappedFilter = {
    fixed_asset?: string[];
    tags?: string[];
    current_status?: string[];
    current_assignee?: string[];
    current_location?: string[];
    maintenance_due_start_date?: Date;
    maintenance_due_end_date?: Date;
  };

  const [mappedFilter, setMappedFilter] = useState<MappedFilter>({});

  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(50);
  const [page, setPage] = useState(1);

  const { data: fixedAssetsData, isLoading } = useGetAllFixedAssets(workspaceId, {
    filter: mappedFilter,
    search,
    limit,
    page,
    sort,
  });

  const handleOpenDialogFilter = () => {
    filterFixedAsset.onTrue();
  };

  const handleSubmitFilter = (values: any) => {
    if (onFilter) {
      onFilter(values);
    }
    filterFixedAsset.onFalse();
  };

  useEffect(() => {
    setMappedFilter({
      current_status: filter?.status,
      tags: defaultTags,
      current_assignee: filter?.assignee?.map((item: any) =>
        typeof item === "string" ? item : item.id
      ),
      current_location: filter?.location?.map((item: any) =>
        typeof item === "string" ? item : item.id
      ),
      maintenance_due_start_date: filter?.start_date,
      maintenance_due_end_date: filter?.end_date,
    });
  }, [filter, defaultTags]);

  return (
    <Stack spacing={1}>
      <CommonAutocompleteInputTag
        size="small"
        defaultValue={defaultTags}
        placeholder="Enter tags ..."
        onChange={(searchTags) => setDefaultTags(searchTags)}
        hideHelperText
      />
      <FixedAssetMaintenanceListTable
        config={config}
        workspaceId={workspaceId}
        fixedAssets={fixedAssetsData?.data}
        pagination={fixedAssetsData?.pagination}
        loading={isLoading}
        onSearch={setSearch}
        onClickFilter={handleOpenDialogFilter}
        onSortChange={setSort}
        onLimitChange={(newLimit: number) => {
          setLimit(newLimit);
          setPage(1);
        }}
        onPageChange={setPage}
        onFullScreen={onFullScreen}
      />

      <CommonDialog
        title="Fixed Asset Filter"
        open={filterFixedAsset.value}
        onClose={filterFixedAsset.onFalse}
      >
        <FixedAssetMaintenanceFilterForm defaultFilter={filter} onFilter={handleSubmitFilter} />
      </CommonDialog>
    </Stack>
  );
}
