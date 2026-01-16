import { debounce } from "lodash";

import { LoadingButton } from "@mui/lab";
import { Stack, Button, TextField, InputAdornment } from "@mui/material";

import Iconify from "src/components/iconify";
import TableToolbarSortMenu from "src/components/sunrise/common/TableToolbarSortMenu";

import { FULL_SCREEN_ICON } from "../../icon-definitions";

type MaintenanceTableToolbarProps = {
  onSearch: (search: string) => void;
  sortOptions?: any[];
  selectedSort?: string;
  onSelectedSort?: (sort: string) => void;
  hideFilter?: boolean;
  onDownloadCSV?: VoidFunction;
  loadingDownloadCSV?: boolean;
  onClickFilter?: VoidFunction;
  hideSearch?: boolean;
  onFullScreen?: VoidFunction;
  config: any;
};
export default function MaintenanceTableToolbar({
  onSearch,
  sortOptions,
  selectedSort,
  onSelectedSort,
  hideFilter,
  onClickFilter,
  onDownloadCSV,
  loadingDownloadCSV,
  hideSearch,
  onFullScreen,
  config,
}: MaintenanceTableToolbarProps) {
  const handleSearchDebounce = debounce((search: string) => {
    onSearch(search);
  }, 500);

  const handleDownloadCSV = () => {
    if (onDownloadCSV) {
      onDownloadCSV();
    }
  };

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
        {!config?.hideFilter && (
          <Button
            variant="contained"
            startIcon={<Iconify icon="mdi:filter-outline" />}
            size="small"
            onClick={() => onClickFilter && onClickFilter()}
          >
            Filter
          </Button>
        )}
        <LoadingButton
          variant="contained"
          loading={loadingDownloadCSV}
          onClick={handleDownloadCSV}
          size="small"
          startIcon={<Iconify icon="mdi:file-export-outline" />}
        >
          Download CSV
        </LoadingButton>
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
      {!hideSearch && (
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
      )}
    </Stack>
  );
}
