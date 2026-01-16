"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

import { Grid, Container } from "@mui/material";

import { paths } from "src/routes/paths";

import { useSettingsContext } from "src/components/settings";
import PageHeader from "src/components/sunrise/common/PageHeader";
import OperationGroupCreateFormContainer from "src/components/sunrise/container/operation-group/OperationGroupCreateFormContainer";

type OperationGroupCreateViewProps = {
  workspaceId: string;
};

export default function OperationGroupCreateView({ workspaceId }: OperationGroupCreateViewProps) {
  const settings = useSettingsContext();
  const { push } = useRouter();

  const queryClient = useQueryClient();
  const handleSuccess = useCallback(() => {
    push(`${paths.app.operationGroup.root(workspaceId)}`);
    queryClient.invalidateQueries(["operationGroups"]);
  }, [push, queryClient, workspaceId]);

  return (
    <Container maxWidth={settings.themeStretch ? false : "xl"}>
      <PageHeader withBackButton />
      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={12} md={4}>
          <OperationGroupCreateFormContainer onSuccess={handleSuccess} workspaceId={workspaceId} />
        </Grid>
      </Grid>
    </Container>
  );
}
