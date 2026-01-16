"use client";

import type { ILifecycleItem, ILifecyclePayload } from "src/types/lifecycle";

import { useSnackbar } from "notistack";
import { useRouter } from "next/navigation";
import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { Grid, Container } from "@mui/material";

import { paths } from "src/routes/paths";

import { updateLifecycle, getLifecycleIdById } from "src/api/lifecycle-api";

import { useSettingsContext } from "src/components/settings";
import { LoadingScreen } from "src/components/loading-screen";
import PageHeader from "src/components/sunrise/common/PageHeader";
import LifecycleForm from "src/components/sunrise/core/lifecycle/LifecycleForm";

import { useWorkspaceContext } from "src/auth/hooks";

type LifecycleEditViewProps = {
  lifecycleId: string;
};

export default function LifecycleEditView({ lifecycleId }: LifecycleEditViewProps) {
  let defaultLifecycle: ILifecycleItem = {} as ILifecycleItem;
  const settings = useSettingsContext();
  const { workspace } = useWorkspaceContext();
  const [isNavigating, setIsNavigating] = useState(false);
  const { push } = useRouter();
  const queryClient = useQueryClient();
  const [submitErrors, setSubmitErrors] = useState<{ field: string; message: string }[]>([]);
  const { enqueueSnackbar } = useSnackbar();

  const {
    data,
    isSuccess,
    isLoading: loadLifecycleLoading,
  } = useQuery({
    queryKey: ["categories", lifecycleId],
    queryFn: () => getLifecycleIdById(lifecycleId),
  });

  if (isSuccess) {
    ({ data: defaultLifecycle } = data);
  }

  const lifecycleMutation = useMutation(
    (lifecycle: ILifecyclePayload) => updateLifecycle(defaultLifecycle?.id as string, lifecycle),
    {
      onSuccess: () => {
        enqueueSnackbar("Lifecycle updated", {
          variant: "success",
          anchorOrigin: { horizontal: "center", vertical: "bottom" },
        });
        setIsNavigating(true);
        push(`${paths.app.lifecycle.root(workspace?.id as string)}`);
        queryClient.invalidateQueries(["categories"]);
      },
      onError: (error: any) => {
        if (error.errors.length) {
          setSubmitErrors([{ field: error.errors[0].field, message: error.errors[0].message }]);
        }
      },
    }
  );
  const handleSubmit = useCallback(
    (lifecyclePayload: ILifecyclePayload) => {
      setSubmitErrors([]);
      lifecycleMutation.mutate(lifecyclePayload);
    },
    [lifecycleMutation]
  );

  if (loadLifecycleLoading || isNavigating) {
    return <LoadingScreen height="50vh" message="Loading Lifecycle ..." />;
  }

  return (
    <Container maxWidth={settings.themeStretch ? false : "xl"}>
      <PageHeader withBackButton />
      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={12} md={4}>
          {isSuccess && (
            <LifecycleForm
              isLoading={lifecycleMutation.isLoading}
              onSubmit={handleSubmit}
              defaultLifecycle={defaultLifecycle}
              submitErrors={submitErrors}
            />
          )}
        </Grid>
      </Grid>
    </Container>
  );
}
