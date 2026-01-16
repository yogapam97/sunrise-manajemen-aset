import { debounce } from "lodash";

import { Stack, TextField, InputAdornment } from "@mui/material";

import Iconify from "src/components/iconify";
import TableToolbarSortMenu from "src/components/sunrise/common/TableToolbarSortMenu";

type LifecycleTableToolbarProps = {
  onSearch: (search: string) => void;
  sortOptions?: any[];
  selectedSort?: string;
  onSelectedSort?: (sort: string) => void;
};
export default function LifecycleTableToolbar({
  onSearch,
  sortOptions,
  selectedSort,
  onSelectedSort,
}: LifecycleTableToolbarProps) {
  const handleSearchDebounce = debounce((search: string) => {
    onSearch(search);
  }, 500);

  return (
    <Stack sx={{ p: 1 }} direction="row" justifyContent="space-between">
      {sortOptions && (
        <TableToolbarSortMenu
          onSelectedSort={onSelectedSort}
          selectedSort={selectedSort}
          sortOptions={sortOptions}
        />
      )}
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
