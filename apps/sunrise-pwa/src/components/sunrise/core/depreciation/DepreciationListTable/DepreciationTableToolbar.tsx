import { debounce } from "lodash";

import { LoadingButton } from "@mui/lab";
import { Stack, Button, TextField, InputAdornment } from "@mui/material";

import Iconify from "src/components/iconify";
import TableToolbarSortMenu from "src/components/sunrise/common/TableToolbarSortMenu";
import TableViewColumnPopover from "src/components/sunrise/common/TableViewColumnPopover";

type DepreciationTableToolbarProps = {
  onSearch: (search: string) => void;
  loadingDownloadCSV?: boolean;
  onDownloadCSV?: VoidFunction;
  onClickFilter?: VoidFunction;
  hideFilter?: boolean;
  columns?: any[];
  onChangeColumns: (columns: any[]) => void;
  sortOptions?: any[];
  selectedSort?: string;
  onSelectedSort?: (sort: string) => void;
};
export default function DepreciationTableToolbar({
  onSearch,
  onDownloadCSV,
  loadingDownloadCSV,
  onClickFilter,
  hideFilter,
  columns,
  onChangeColumns,
  sortOptions,
  selectedSort,
  onSelectedSort,
}: DepreciationTableToolbarProps) {
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
        <LoadingButton
          variant="contained"
          loading={loadingDownloadCSV}
          onClick={handleDownloadCSV}
          size="small"
          startIcon={<Iconify icon="mdi:file-export-outline" />}
        >
          Download CSV
        </LoadingButton>

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
          <TableViewColumnPopover onChangeColumns={onChangeColumns} columns={columns} />
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
