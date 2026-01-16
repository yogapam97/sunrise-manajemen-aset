import { PDFViewer } from "@react-pdf/renderer";
import { useSearchParams } from "next/navigation";
import { useState, useEffect, useCallback } from "react";

import {
  Box,
  Stack,
  Button,
  Dialog,
  IconButton,
  DialogTitle,
  DialogActions,
  DialogContent,
} from "@mui/material";

import { useBoolean } from "src/hooks/use-boolean";

import Iconify from "src/components/iconify";

import FixedAssetPDF from "../../core/fixed-asset/FixedAssetPDF";
import FixedAssetListTable from "../../core/fixed-asset/FixedAssetListTable";
import FixedAssetFilterForm from "../../core/fixed-asset/FixedAssetFilterForm";
import CommonAutocompleteInputTag from "../../core/common/CommonAutocompleteInputTag";
import {
  useDeleteFixedAsset,
  useGetAllFixedAssets,
  useDownloadFixedAssets,
  useGenerateLabelFixedAsset,
} from "../../hook/useFixedAssets";

type FixedAssetTableContainerProps = {
  workspaceId: string;
  filter?: any;
  config?: any;
  onFilter?: (values: any) => void;
  onFullScreen?: VoidFunction;
};

export default function FixedAssetTableContainer({
  workspaceId,
  filter,
  config,
  onFilter,
  onFullScreen,
}: FixedAssetTableContainerProps) {
  const [fixedAssetsLabel, setFixedAssetsLabel] = useState<string[]>([]);
  const [sort, setSort] = useState<string>("updated_at:desc");
  const generateQrCodeDialog = useBoolean();
  const searchParams = useSearchParams();

  const tags = searchParams.getAll("tags[]") || [];
  const [defaultTags, setDefaultTags] = useState<string[]>(tags);
  const filterFixedAsset = useBoolean();
  type MappedFilter = {
    code?: string;
    serial_number?: string;
    tags?: string[];
    lifecycle?: any[];
    category?: any[];
    current_location?: any[];
    current_assignee?: any[];
    supplier?: any[];
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

  const deleteMutation = useDeleteFixedAsset();
  const labelGeneratorMutation = useGenerateLabelFixedAsset(workspaceId, {
    onSuccess: (response) => {
      const { data: dataLabel } = response;
      setFixedAssetsLabel(dataLabel);
      generateQrCodeDialog.onTrue();
    },
  });

  const { refetch: refetchDownloadCSV, isFetching: loadingDownloadCSV } = useDownloadFixedAssets(
    workspaceId,
    {
      filter: mappedFilter,
      search,
    }
  );

  const handleDeleteFixedAsset = useCallback(
    (fixedAssetId: string) => {
      deleteMutation.mutate(fixedAssetId);
    },
    [deleteMutation]
  );

  const handleGenerateQrCode = useCallback(
    async (ids: string[]) => {
      labelGeneratorMutation.mutate(ids);
    },
    [labelGeneratorMutation]
  );

  const handleDownloadCSV = useCallback(async () => {
    const { data } = await refetchDownloadCSV();
    if (data) {
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement("a");
      link.href = url;
      const date = new Date();
      const formattedDate =
        date.toISOString().slice(0, 10).replace(/-/g, "") +
        date.toTimeString().slice(0, 8).replace(/:/g, "");
      link.setAttribute("download", `fixed_assets-${formattedDate}.csv`);
      document.body.appendChild(link);
      link.click();
    }
  }, [refetchDownloadCSV]);

  const handleOpenDialogFilter = () => {
    filterFixedAsset.onTrue();
  };

  const handleSubmitFilter = (values: any) => {
    if (onFilter) {
      onFilter(values);
    }
    filterFixedAsset.onFalse();
  };

  const handleFullScreen = () => {
    if (onFullScreen) {
      onFullScreen();
    }
  };

  useEffect(() => {
    setMappedFilter({
      code: filter?.code,
      serial_number: filter?.serial_number,
      tags: defaultTags,
      lifecycle: filter?.lifecycle?.map((item: any) => (typeof item === "string" ? item : item.id)),
      category: filter?.category?.map((item: any) => (typeof item === "string" ? item : item.id)),
      current_location: filter?.location?.map((item: any) =>
        typeof item === "string" ? item : item.id
      ),
      current_assignee: filter?.assignee?.map((item: any) =>
        typeof item === "string" ? item : item.id
      ),
      supplier: filter?.supplier?.map((item: any) => (typeof item === "string" ? item : item.id)),
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
      <FixedAssetListTable
        config={config}
        workspaceId={workspaceId}
        fixedAssets={fixedAssetsData?.data}
        pagination={fixedAssetsData?.pagination}
        loading={isLoading}
        onDeleteRow={handleDeleteFixedAsset}
        onSearch={setSearch}
        onGenerateQr={handleGenerateQrCode}
        onDownloadCSV={handleDownloadCSV}
        loadingDownloadCSV={loadingDownloadCSV}
        onClickFilter={handleOpenDialogFilter}
        onSortChange={setSort}
        onLimitChange={(newLimit: number) => {
          setLimit(newLimit);
          setPage(1);
        }}
        onPageChange={setPage}
        onFullScreen={handleFullScreen}
      />

      <Dialog open={filterFixedAsset.value}>
        <DialogTitle align="center" variant="subtitle2">
          Filter Fixed Asset
        </DialogTitle>
        <DialogContent>
          <Box sx={{ width: 320, height: 1, overflow: "hidden" }}>
            <FixedAssetFilterForm defaultFilter={filter} onFilter={handleSubmitFilter} />
          </Box>
        </DialogContent>
        <IconButton
          aria-label="close"
          onClick={filterFixedAsset.onFalse}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme: any) => theme.palette.grey[500],
          }}
        >
          <Iconify icon="solar:close-circle-outline" />
        </IconButton>
      </Dialog>

      <Dialog fullScreen open={generateQrCodeDialog.value}>
        <Box sx={{ height: 1, display: "flex", flexDirection: "column" }}>
          <DialogActions
            sx={{
              p: 1.5,
            }}
          >
            <Button color="inherit" variant="contained" onClick={generateQrCodeDialog.onFalse}>
              Close
            </Button>
          </DialogActions>

          <Box sx={{ flexGrow: 1, height: 1, overflow: "hidden" }}>
            <PDFViewer width="100%" height="100%" style={{ border: "none" }}>
              <FixedAssetPDF fixedAssets={fixedAssetsLabel} />
            </PDFViewer>
          </Box>
        </Box>
      </Dialog>
    </Stack>
  );
}
