"use client";

import type { ILifecyclePayload } from "src/types/lifecycle";

import { useSnackbar } from "notistack";
import { useRouter } from "next/navigation";
import { useState, useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Grid, Container } from "@mui/material";

import { paths } from "src/routes/paths";

import { createLifecycle } from "src/api/lifecycle-api";

import { useSettingsContext } from "src/components/settings";
import PageHeader from "src/components/sunrise/common/PageHeader";
import LifecycleForm from "src/components/sunrise/core/lifecycle/LifecycleForm";

import { useWorkspaceContext } from "src/auth/hooks";

type LifecycleCreateViewProps = {
  workspaceId: string;
};

export default function LifecycleCreateView({ workspaceId }: LifecycleCreateViewProps) {
  const settings = useSettingsContext();
  const [isNavigating, setIsNavigating] = useState<boolean>(false);
  const [submitErrors, setSubmitErrors] = useState<{ field: string; message: string }[]>([]);
  const { workspace } = useWorkspaceContext();
  const { enqueueSnackbar } = useSnackbar();
  const { push } = useRouter();
  const queryClient = useQueryClient();
  const lifecycleMutation = useMutation(
    (lifecycle: ILifecyclePayload) => createLifecycle(lifecycle),
    {
      onSuccess: () => {
        enqueueSnackbar("Lifecycle created", {
          variant: "success",
          anchorOrigin: { horizontal: "center", vertical: "bottom" },
        });
        setIsNavigating(true);
        push(`${paths.app.lifecycle.root(workspace?.id as string)}`);
        queryClient.invalidateQueries(["lifecycles"]);
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

  const isLoading = lifecycleMutation.isLoading || isNavigating;

  return (
    <Container maxWidth={settings.themeStretch ? false : "xl"}>
      <PageHeader withBackButton />
      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={12} md={4}>
          <LifecycleForm
            isLoading={isLoading}
            onSubmit={handleSubmit}
            submitErrors={submitErrors}
          />
        </Grid>
      </Grid>
    </Container>
  );
}
