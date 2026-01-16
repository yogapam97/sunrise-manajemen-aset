"use client";

import { useState } from "react";
import { useSnackbar } from "notistack";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Box, Grid, Stack, Container, Typography } from "@mui/material";

import { paths } from "src/routes/paths";

import { importFixedAsset } from "src/api/fixed-asset-api";

import Iconify from "src/components/iconify/iconify";
import { useSettingsContext } from "src/components/settings";
import PageHeader from "src/components/sunrise/common/PageHeader";
import BackButton from "src/components/sunrise/common/button/BackButton";
import { FIXED_ASSET_ICON } from "src/components/sunrise/core/icon-definitions";
import FixedAssetImportStep from "src/components/sunrise/core/fixed-asset/FixedAssetImportStep";

type FixedAssetImportViewProps = {
  workspaceId: string;
};

export default function FixedAssetImportView({ workspaceId }: FixedAssetImportViewProps) {
  const settings = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { push } = useRouter();
  const [importErrors, setImportErrors] = useState<{ field: string; message: string }[]>([]);

  const fixedAssetImportMutation = useMutation(
    (fixedAssets: any[]) => importFixedAsset(workspaceId, fixedAssets),
    {
      onSuccess: () => {
        enqueueSnackbar("Fixed Asset Imported", {
          variant: "success",
          anchorOrigin: { horizontal: "center", vertical: "bottom" },
        });
        push(`${paths.app.fixedAsset.root(workspaceId as string)}`);
        queryClient.invalidateQueries(["fixedAssets"]);
      },
      onError: (error: any) => {
        if (error.errors.length) {
          setImportErrors(error.errors);
        }
      },
    }
  );

  const handleImport = (fixedAssets: any[]) => {
    setImportErrors([]);
    fixedAssetImportMutation.mutate(fixedAssets);
  };

  return (
    <Container maxWidth={settings.themeStretch ? false : "xl"}>
      <PageHeader
        heading={
          <Stack direction="row" alignItems="center" spacing={1}>
            <Iconify icon={FIXED_ASSET_ICON} />
            <Typography variant="h5">Fixed Asset Import</Typography>
          </Stack>
        }
      />
      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={12} md={12}>
          <Stack spacing={1}>
            <Box>
              <BackButton />
            </Box>
            <FixedAssetImportStep
              onImport={handleImport}
              importErrors={importErrors}
              importLoading={fixedAssetImportMutation.isLoading}
              onReset={() => setImportErrors([])}
            />
          </Stack>
        </Grid>
      </Grid>
    </Container>
  );
}
