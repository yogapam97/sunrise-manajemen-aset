"use client";

import { Grid, Stack, Button, Container, Typography } from "@mui/material";

import { paths } from "src/routes/paths";
import { RouterLink } from "src/routes/components";

import Iconify from "src/components/iconify";
import { useSettingsContext } from "src/components/settings";
import PageHeader from "src/components/sunrise/common/PageHeader";
import { METRIC_ICON } from "src/components/sunrise/core/icon-definitions";
import MetricTableContainer from "src/components/sunrise/container/metric/MetricTableContainer";

type WorkspaceListViewProps = {
  workspaceId: string;
};

export default function MetricListView({ workspaceId }: WorkspaceListViewProps) {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : "xl"}>
      <PageHeader
        heading={
          <Stack direction="row" alignItems="center" spacing={1}>
            <Iconify icon={METRIC_ICON} />
            <Typography variant="h5">Metric</Typography>
          </Stack>
        }
        action={
          <Button
            component={RouterLink}
            href={paths.app.metric.create(workspaceId)}
            variant="contained"
            startIcon={<Iconify icon="mdi:plus" />}
          >
            Add Metric
          </Button>
        }
      />
      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={12} md={12}>
          <MetricTableContainer workspaceId={workspaceId} />
        </Grid>
      </Grid>
    </Container>
  );
}
