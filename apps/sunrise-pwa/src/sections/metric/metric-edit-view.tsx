"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

import { Grid, Container } from "@mui/material";

import { paths } from "src/routes/paths";

import { useSettingsContext } from "src/components/settings";
import PageHeader from "src/components/sunrise/common/PageHeader";
import MetricEditFormContainer from "src/components/sunrise/container/metric/MetricEditFormContainer";

type MetricEditViewProps = {
  workspaceId: string;
  metricId: string;
};

export default function MetricEditView({ workspaceId, metricId }: MetricEditViewProps) {
  const settings = useSettingsContext();
  const { push } = useRouter();

  const queryClient = useQueryClient();
  const handleSuccess = useCallback(() => {
    push(`${paths.app.metric.root(workspaceId)}`);
    queryClient.invalidateQueries(["metrics"]);
  }, [push, queryClient, workspaceId]);

  return (
    <Container maxWidth={settings.themeStretch ? false : "xl"}>
      <PageHeader withBackButton />
      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={12} md={8}>
          <MetricEditFormContainer
            onSuccess={handleSuccess}
            workspaceId={workspaceId}
            metricId={metricId}
          />
        </Grid>
      </Grid>
    </Container>
  );
}
