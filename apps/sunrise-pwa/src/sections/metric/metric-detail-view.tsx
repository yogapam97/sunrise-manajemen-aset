"use client";

import { Grid, Button, Container } from "@mui/material";

import { paths } from "src/routes/paths";
import { RouterLink } from "src/routes/components";

import { useSettingsContext } from "src/components/settings";
import PageHeader from "src/components/sunrise/common/PageHeader";
import MetricDetailContainer from "src/components/sunrise/container/metric/MetricDetailContainer";

type MetricDetailViewProps = {
  metricId: string;
  workspaceId: string;
};

export default function MetricDetailView({ metricId, workspaceId }: MetricDetailViewProps) {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : "xl"}>
      <PageHeader
        withBackButton
        action={
          <Button
            variant="contained"
            component={RouterLink}
            href={paths.app.metric.edit(workspaceId, metricId)}
          >
            Edit Metric
          </Button>
        }
      />
      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={12} md={12}>
          <MetricDetailContainer workspaceId={workspaceId} metricId={metricId} />
        </Grid>
      </Grid>
    </Container>
  );
}
