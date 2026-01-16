"use client";

import nProgress from "nprogress";
import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

import { Grid, Container } from "@mui/material";

import { paths } from "src/routes/paths";

import { useSettingsContext } from "src/components/settings";
import PageHeader from "src/components/sunrise/common/PageHeader";
import OperationGroupDoFormContainer from "src/components/sunrise/container/operation-group/OperationGroupDoFormContainer";

type OperationGroupDoViewProps = {
  workspaceId: string;
  operationGroupId: string;
};

export default function OperationGroupDoView({
  workspaceId,
  operationGroupId,
}: OperationGroupDoViewProps) {
  const settings = useSettingsContext();
  const { push } = useRouter();

  const queryClient = useQueryClient();
  const handleSuccess = useCallback(() => {
    nProgress.start();
    push(`${paths.app.operationGroup.detail(workspaceId, operationGroupId)}?tab=operation-log`);
    queryClient.invalidateQueries(["operationGroups"]);
  }, [push, queryClient, workspaceId, operationGroupId]);

  return (
    <Container maxWidth={settings.themeStretch ? false : "xl"}>
      <PageHeader withBackButton />
      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={12} md={12}>
          <OperationGroupDoFormContainer
            onSuccess={handleSuccess}
            workspaceId={workspaceId}
            operationGroupId={operationGroupId}
          />
        </Grid>
      </Grid>
    </Container>
  );
}
