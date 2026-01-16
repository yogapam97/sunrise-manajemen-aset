import { debounce } from "lodash";

import { LoadingButton } from "@mui/lab";
import { Stack, Button, TextField, InputAdornment } from "@mui/material";

import { paths } from "src/routes/paths";
import { RouterLink } from "src/routes/components";

import Iconify from "src/components/iconify";
import TableToolbarSortMenu from "src/components/sunrise/common/TableToolbarSortMenu";

import { FULL_SCREEN_ICON } from "../../icon-definitions";
import FixedAssetTableViewColumnPopover from "./FixedAssetTableViewColumnPopover";

type FixedAssetTableToolbarProps = {
  workspaceId: string;
  onSearch: (search: string) => void;
  selectedItems: string[];
  onGenerateQr: VoidFunction;
  hideImport: boolean;
  hideFilter: boolean;
  onDownloadCSV?: VoidFunction;
  loadingDownloadCSV?: boolean;
  onClickFilter?: VoidFunction;
  columns?: any[];
  onChangeColumns: (columns: any[]) => void;
  sortOptions?: any[];
  selectedSort?: string;
  onSelectedSort?: (sort: string) => void;
  onFullScreen: VoidFunction;
  config: any;
};
export default function FixedAssetTableToolbar({
  hideImport,
  hideFilter,
  workspaceId,
  onSearch,
  selectedItems,
  onGenerateQr,
  onDownloadCSV,
  loadingDownloadCSV,
  onClickFilter,
  columns,
  onChangeColumns,
  sortOptions,
  selectedSort,
  onSelectedSort,
  onFullScreen,
  config,
}: FixedAssetTableToolbarProps) {
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
        {!hideImport && (
          <Button
            variant="contained"
            component={RouterLink}
            href={paths.app.fixedAsset.import(workspaceId)}
            size="small"
            startIcon={<Iconify icon="mdi:file-import-outline" />}
          >
            Import CSV
          </Button>
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
        {columns?.length && (
          <FixedAssetTableViewColumnPopover onChangeColumns={onChangeColumns} columns={columns} />
        )}
        <Button
          variant="contained"
          size="small"
          startIcon={<Iconify icon="mdi:qrcode" />}
          onClick={() => onGenerateQr()}
          disabled={!selectedItems.length}
        >
          Generate Qr ({selectedItems.length})
        </Button>
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
