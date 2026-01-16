import { debounce } from "lodash";

import { Stack, Button, TextField, InputAdornment } from "@mui/material";

import Iconify from "src/components/iconify";
import TableToolbarSortMenu from "src/components/sunrise/common/TableToolbarSortMenu";

import { FULL_SCREEN_ICON } from "../../icon-definitions";
import FixedAssetCheckTableViewColumnPopover from "./FixedAssetCheckTableViewColumnPopover";

type FixedAssetCheckTableToolbarProps = {
  onSearch: (search: string) => void;
  hideFilter: boolean;
  onClickFilter?: VoidFunction;
  columns?: any[];
  onChangeColumns: (columns: any[]) => void;
  sortOptions?: any[];
  selectedSort?: string;
  onSelectedSort?: (sort: string) => void;
  onFullScreen: VoidFunction;
  config: any;
};
export default function FixedAssetCheckTableToolbar({
  hideFilter,
  onSearch,
  onClickFilter,
  columns,
  onChangeColumns,
  sortOptions,
  selectedSort,
  onSelectedSort,
  onFullScreen,
  config,
}: FixedAssetCheckTableToolbarProps) {
  const handleSearchDebounce = debounce((search: string) => {
    onSearch(search);
  }, 500);

  return (
    <Stack sx={{ p: 1 }} direction="row" justifyContent="space-between">
      <Stack direction="row" spacing={1}>
        {sortOptions && (
          <TableToolbarSortMenu
            onSelectedSort={onSelectedSort}
            selectedSort={selectedSort}
            sortOptions={sortOptions}
          />
        )}
        {!hideFilter && (
          <Button
            variant="contained"
            startIcon={<Iconify icon="mdi:filter-outline" />}
            size="small"
            onClick={() => onClickFilter && onClickFilter()}
          >
            Filter
          </Button>
        )}
        {columns?.length && (
          <FixedAssetCheckTableViewColumnPopover
            onChangeColumns={onChangeColumns}
            columns={columns}
          />
        )}
        {!config?.hideFullScreen && (
          <Button
            variant="contained"
            size="small"
            startIcon={<Iconify icon={FULL_SCREEN_ICON} />}
            onClick={onFullScreen}
          >
            Full Screen
          </Button>
        )}
      </Stack>
      <TextField
        size="small"
        placeholder="Search ..."
        onChange={(e) => handleSearchDebounce(e.target.value)}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Iconify icon="material-symbols:search-rounded" />
            </InputAdornment>
          ),
        }}
      />
    </Stack>
  );
}
