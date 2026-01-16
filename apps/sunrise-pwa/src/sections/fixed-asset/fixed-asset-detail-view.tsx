"use client";

import type { IFixedAssetItem } from "src/types/fixed-asset";

import nProgress from "nprogress";
import { useRouter } from "next/navigation";
import { useState, useCallback } from "react";
import { PDFViewer } from "@react-pdf/renderer";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { LoadingButton } from "@mui/lab";
import {
  Box,
  Grid,
  Stack,
  Button,
  Dialog,
  Container,
  Typography,
  DialogActions,
} from "@mui/material";

import { paths } from "src/routes/paths";

import { useBoolean } from "src/hooks/use-boolean";

import { createLabels } from "src/api/label-generator-api";
import { deleteFixedAsset, getFixedAssetById } from "src/api/fixed-asset-api";

import Iconify from "src/components/iconify";
import { usePopover } from "src/components/custom-popover";
import { useSettingsContext } from "src/components/settings";
import { LoadingScreen } from "src/components/loading-screen";
import PageHeader from "src/components/sunrise/common/PageHeader";
import { DROPDOWN_ICON } from "src/components/sunrise/core/icon-definitions";
import ConfirmDialog from "src/components/sunrise/common/dialog/ConfirmDialog";
import FixedAssetPDF from "src/components/sunrise/core/fixed-asset/FixedAssetPDF";
import FixedAssetDetailTab from "src/components/sunrise/core/fixed-asset/FixedAssetDetailTab";
import FixedAssetMenuPopover from "src/components/sunrise/core/fixed-asset/FixedAssetMenuPopover";
import FixedAssetDetailVertical from "src/components/sunrise/core/fixed-asset/FixedAssetDetailVertical";

type FixedAssetDetailViewProps = {
  workspaceId: string;
  fixedAssetId: string;
};

export default function FixedAssetDetailView({
  workspaceId,
  fixedAssetId,
}: FixedAssetDetailViewProps) {
  let fixedAsset: IFixedAssetItem = {} as IFixedAssetItem;
  const settings = useSettingsContext();
  const [fixedAssetsLabel, setFixedAssetsLabel] = useState<string[]>([]);
  const popover = usePopover();
  const deleteConfirm = useBoolean();
  const generateQrCodeDialog = useBoolean();
  const { push } = useRouter();
  const queryClient = useQueryClient();
  const [focusTab, setFocusTab] = useState<string>("overview");

  const {
    data,
    isLoading: isDeleteLoading,
    isSuccess,
  } = useQuery({
    queryKey: ["fixedAssets", fixedAssetId],
    queryFn: () => getFixedAssetById(workspaceId, fixedAssetId),
  });

  if (isSuccess) {
    ({ data: fixedAsset } = data);
  }

  const { mutate, isLoading } = useMutation(() => deleteFixedAsset(fixedAssetId), {
    onSuccess: () => {
      push(`${paths.app.fixedAsset.root(workspaceId as string)}`);
      queryClient.invalidateQueries(["fixedAssets"]);
    },
  });

  const labelGeneratorMutation = useMutation(
    () => createLabels(workspaceId, { fixed_assets: [{ id: fixedAssetId }] }),
    {
      onSuccess: (response) => {
        const { data: dataLabel } = response;
        setFixedAssetsLabel(dataLabel);
        generateQrCodeDialog.onTrue();
        queryClient.invalidateQueries(["labelGenerators", fixedAssetId]);
      },
    }
  );

  const handleGenerateQrCode = useCallback(async () => {
    labelGeneratorMutation.mutate();
  }, [labelGeneratorMutation]);

  const handleDeleteFixedAsset = useCallback(() => {
    mutate();
    deleteConfirm.onFalse();
  }, [mutate, deleteConfirm]);

  const handleDeleted = () => {
    nProgress.start();
    push(`${paths.app.fixedAsset.root(workspaceId as string)}`);
    queryClient.invalidateQueries(["fixedAssets"]);
  };

  if (isLoading || isDeleteLoading) {
    return <LoadingScreen height="50vh" message="Loading Fixed Asset ..." />;
  }
  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : "xl"}>
        <PageHeader
          withBackButton
          action={
            <>
              <Button
                variant="contained"
                onClick={popover.onOpen}
                startIcon={<Iconify icon={DROPDOWN_ICON} />}
              >
                Action
              </Button>
              <FixedAssetMenuPopover
                workspaceId={workspaceId}
                fixedAsset={fixedAsset}
                onDeleted={handleDeleted}
                open={popover.open}
                onClose={popover.onClose}
                arrow="right-top"
              />
            </>
          }
        />
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={12} md={4}>
            <FixedAssetDetailVertical fixedAsset={fixedAsset} onChangeTab={setFocusTab} />

            <Stack sx={{ mt: 2 }} spacing={2}>
              <Box>
                <LoadingButton
                  loading={labelGeneratorMutation.isLoading}
                  fullWidth
                  variant="outlined"
                  size="small"
                  onClick={handleGenerateQrCode}
                >
                  Generate QR Code
                </LoadingButton>
              </Box>
            </Stack>
          </Grid>
          <Grid item xs={12} md={8}>
            <FixedAssetDetailTab
              workspaceId={workspaceId}
              fixedAsset={fixedAsset}
              focusTab={focusTab}
              onChangeTab={setFocusTab}
            />
          </Grid>
        </Grid>
      </Container>

      <ConfirmDialog
        open={deleteConfirm.value}
        onClose={deleteConfirm.onFalse}
        title="Delete"
        content={
          <Box sx={{ color: "text.secondary" }}>
            <Typography variant="subtitle2">{fixedAsset?.name}</Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Are you sure you want to delete this fixed asset?
            </Typography>
          </Box>
        }
        action={
          <Button variant="contained" color="error" onClick={handleDeleteFixedAsset}>
            Delete
          </Button>
        }
      />
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
    </>
  );
}
