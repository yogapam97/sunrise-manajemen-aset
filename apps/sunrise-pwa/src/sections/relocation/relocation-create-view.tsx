"use client";

import nProgress from "nprogress";
import { useCallback } from "react";
import { useRouter } from "next/navigation";

import { Grid, Container } from "@mui/material";

import { paths } from "src/routes/paths";

import { useSettingsContext } from "src/components/settings";
import PageHeader from "src/components/sunrise/common/PageHeader";
import RelocationCreateFormContainer from "src/components/sunrise/container/relocation/RelocationCreateFormContainer";

type RelocationCreateViewProps = {
  workspaceId: string;
};

export default function RelocationCreateView({ workspaceId }: RelocationCreateViewProps) {
  const settings = useSettingsContext();
  const { push } = useRouter();

  const handleSuccess = useCallback(() => {
    nProgress.start();
    push(`${paths.app.relocation.root(workspaceId)}`);
  }, [push, workspaceId]);

  return (
    <Container maxWidth={settings.themeStretch ? false : "xl"}>
      <PageHeader withBackButton />
      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={12} md={8}>
          <RelocationCreateFormContainer workspaceId={workspaceId} onSuccess={handleSuccess} />
        </Grid>
      </Grid>
    </Container>
  );
}
