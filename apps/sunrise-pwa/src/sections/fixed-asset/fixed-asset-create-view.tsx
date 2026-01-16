"use client";

import type { IFixedAssetPayload } from "src/types/fixed-asset";

import { useSnackbar } from "notistack";
import { useRouter } from "next/navigation";
import { useState, useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Grid, Container } from "@mui/material";

import { paths } from "src/routes/paths";

import { createFixedAsset } from "src/api/fixed-asset-api";

import { useSettingsContext } from "src/components/settings";
import PageHeader from "src/components/sunrise/common/PageHeader";
import FixedAssetForm from "src/components/sunrise/core/fixed-asset/FixedAssetForm";

type FixedAssetCreateViewProps = {
  workspaceId: string;
};

export default function FixedAssetCreateView({ workspaceId }: FixedAssetCreateViewProps) {
  const settings = useSettingsContext();
  const { push } = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [submitErrors, setSubmitErrors] = useState<{ field: string; message: string }[]>([]);

  const [isNavigating, setIsNavigating] = useState<boolean>(false);

  const queryClient = useQueryClient();
  const fixedAssetMutation = useMutation(
    (fixedAsset: IFixedAssetPayload) => createFixedAsset(workspaceId, fixedAsset),
    {
      onSuccess: () => {
        enqueueSnackbar("Fixed Asset created", {
          variant: "success",
          anchorOrigin: { horizontal: "center", vertical: "bottom" },
        });
        setIsNavigating(true);
        push(`${paths.app.fixedAsset.root(workspaceId as string)}`);
        queryClient.invalidateQueries(["fixedAssets"]);
      },
      onError: (error: any) => {
        if (error.errors.length) {
          setSubmitErrors([{ field: error.errors[0].field, message: error.errors[0].message }]);
        }
      },
    }
  );

  const handleSubmit = useCallback(
    (fixedAssetPayload: IFixedAssetPayload) => {
      setSubmitErrors([]);
      fixedAssetMutation.mutate(fixedAssetPayload);
    },
    [fixedAssetMutation]
  );

  const isLoading = fixedAssetMutation.isLoading || isNavigating;

  return (
    <Container maxWidth={settings.themeStretch ? false : "xl"}>
      <PageHeader withBackButton />
      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={12} md={12}>
          <FixedAssetForm
            workspaceId={workspaceId}
            loading={isLoading}
            onSubmit={handleSubmit}
            submitErrors={submitErrors}
          />
        </Grid>
      </Grid>
    </Container>
  );
}
