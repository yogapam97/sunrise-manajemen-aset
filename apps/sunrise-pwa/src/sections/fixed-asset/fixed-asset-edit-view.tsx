"use client";

import type { IFixedAssetItem, IFixedAssetPayload } from "src/types/fixed-asset";

import { useSnackbar } from "notistack";
import { useRouter } from "next/navigation";
import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { Grid, Container } from "@mui/material";

import { paths } from "src/routes/paths";

import { updateFixedAsset, getFixedAssetById } from "src/api/fixed-asset-api";

import { useSettingsContext } from "src/components/settings";
import { LoadingScreen } from "src/components/loading-screen";
import PageHeader from "src/components/sunrise/common/PageHeader";
import FixedAssetForm from "src/components/sunrise/core/fixed-asset/FixedAssetForm";

import { useWorkspaceContext } from "src/auth/hooks";

type FixedAssetEditViewProps = {
  workspaceId: string;
  fixedAssetId: string;
};

export default function FixedAssetEditView({ workspaceId, fixedAssetId }: FixedAssetEditViewProps) {
  let defaultFixedAsset: IFixedAssetItem = {} as IFixedAssetItem;
  const settings = useSettingsContext();
  const { workspace } = useWorkspaceContext();
  const [isNavigating, setIsNavigating] = useState(false);
  const { push } = useRouter();
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const [submitErrors, setSubmitErrors] = useState<{ field: string; message: string }[]>([]);

  const {
    data,
    isSuccess,
    isLoading: loadFixedAssetLoading,
  } = useQuery({
    queryKey: ["fixedAssets", fixedAssetId],
    queryFn: () => getFixedAssetById(workspaceId, fixedAssetId),
  });

  if (isSuccess) {
    ({ data: defaultFixedAsset } = data);
  }

  const fixedAssetMutation = useMutation(
    (fixedAsset: IFixedAssetPayload) =>
      updateFixedAsset(workspaceId, defaultFixedAsset?.id as string, fixedAsset),
    {
      onSuccess: () => {
        enqueueSnackbar("Fixed Asset updated", {
          variant: "success",
          anchorOrigin: { horizontal: "center", vertical: "bottom" },
        });
        setIsNavigating(true);
        push(`${paths.app.fixedAsset.root(workspace?.id as string)}`);
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

  if (loadFixedAssetLoading || isNavigating) {
    return <LoadingScreen height="50vh" message="Loading Fixed Asset ..." />;
  }

  return (
    <Container maxWidth={settings.themeStretch ? false : "xl"}>
      <PageHeader withBackButton />
      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={12} md={12}>
          {isSuccess && (
            <FixedAssetForm
              workspaceId={workspaceId}
              loading={fixedAssetMutation.isLoading}
              onSubmit={handleSubmit}
              defaultFixedAsset={defaultFixedAsset}
              submitErrors={submitErrors}
              isEdit
            />
          )}
        </Grid>
      </Grid>
    </Container>
  );
}
