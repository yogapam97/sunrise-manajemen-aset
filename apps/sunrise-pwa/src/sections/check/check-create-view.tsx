"use client";

import nProgress from "nprogress";
import { useCallback } from "react";
import { useRouter } from "next/navigation";

import { Grid, Container } from "@mui/material";

import { paths } from "src/routes/paths";

import { useSettingsContext } from "src/components/settings";
import PageHeader from "src/components/sunrise/common/PageHeader";
import CheckCreateFormContainer from "src/components/sunrise/container/check/CheckCreateFormContainer";

type CheckCreateViewProps = {
  workspaceId: string;
};

export default function CheckCreateView({ workspaceId }: CheckCreateViewProps) {
  const settings = useSettingsContext();
  const { push } = useRouter();

  const handleSuccess = useCallback(() => {
    nProgress.start();
    push(`${paths.app.check.root(workspaceId)}`);
  }, [push, workspaceId]);

  return (
    <Container maxWidth={settings.themeStretch ? false : "xl"}>
      <PageHeader withBackButton />
      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={12} md={8}>
          <CheckCreateFormContainer workspaceId={workspaceId} onSuccess={handleSuccess} />
        </Grid>
      </Grid>
    </Container>
  );
}
