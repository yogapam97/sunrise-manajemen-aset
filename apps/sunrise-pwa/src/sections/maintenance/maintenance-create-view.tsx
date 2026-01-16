"use client";

import nProgress from "nprogress";
import { useCallback } from "react";
import { useRouter } from "next/navigation";

import { Grid, Container } from "@mui/material";

import { paths } from "src/routes/paths";

import { useSettingsContext } from "src/components/settings";
import PageHeader from "src/components/sunrise/common/PageHeader";
import MaintenanceCreateFormContainer from "src/components/sunrise/container/maintenance/MaintenanceCreateFormContainer";

type MaintenanceCreateViewProps = {
  workspaceId: string;
};

export default function MaintenanceCreateView({ workspaceId }: MaintenanceCreateViewProps) {
  const settings = useSettingsContext();
  const { push } = useRouter();

  const handleSuccess = useCallback(() => {
    nProgress.start();
    push(`${paths.app.maintenance.root(workspaceId)}`);
  }, [push, workspaceId]);

  return (
    <Container maxWidth={settings.themeStretch ? false : "xl"}>
      <PageHeader withBackButton />
      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={12} md={8}>
          <MaintenanceCreateFormContainer workspaceId={workspaceId} onSuccess={handleSuccess} />
        </Grid>
      </Grid>
    </Container>
  );
}
