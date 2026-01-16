"use client";

import { Grid, Stack, Button, Container, Typography } from "@mui/material";

import { paths } from "src/routes/paths";
import { RouterLink } from "src/routes/components";

import Iconify from "src/components/iconify";
import { useSettingsContext } from "src/components/settings";
import PageHeader from "src/components/sunrise/common/PageHeader";
import LifecycleIcon from "src/components/sunrise/core/lifecycle/LifecycleIcon";
import LifecycleTableContainer from "src/components/sunrise/container/lifecycle/LifecycleTableContainer";

type WorkspaceListViewProps = {
  workspaceId: string;
};

export default function LifecycleListView({ workspaceId }: WorkspaceListViewProps) {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : "xl"}>
      <PageHeader
        heading={
          <Stack direction="row" alignItems="center" spacing={1}>
            <LifecycleIcon />
            <Typography variant="h5">Lifecycle</Typography>
          </Stack>
        }
        action={
          <Button
            component={RouterLink}
            href={paths.app.lifecycle.create(workspaceId)}
            variant="contained"
            startIcon={<Iconify icon="mdi:plus" />}
          >
            Add Lifecycle
          </Button>
        }
      />
      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={12} md={12}>
          <LifecycleTableContainer workspaceId={workspaceId} />
        </Grid>
      </Grid>
    </Container>
  );
}
