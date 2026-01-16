"use client";

import { Grid, Stack, Button, Container, Typography } from "@mui/material";

import { paths } from "src/routes/paths";
import { RouterLink } from "src/routes/components";

import Iconify from "src/components/iconify";
import { useSettingsContext } from "src/components/settings";
import PageHeader from "src/components/sunrise/common/PageHeader";
import LocationIcon from "src/components/sunrise/core/location/LocationIcon";
import LocationTableContainer from "src/components/sunrise/container/location/LocationTableContainer";

type WorkspaceListViewProps = {
  workspaceId: string;
};

export default function LocationListView({ workspaceId }: WorkspaceListViewProps) {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : "xl"}>
      <PageHeader
        heading={
          <Stack direction="row" alignItems="center" spacing={1}>
            <LocationIcon />
            <Typography variant="h5">Location</Typography>
          </Stack>
        }
        action={
          <Button
            component={RouterLink}
            href={paths.app.location.create(workspaceId)}
            variant="contained"
            startIcon={<Iconify icon="mdi:plus" />}
          >
            Add Location
          </Button>
        }
      />
      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={12} md={12}>
          <LocationTableContainer workspaceId={workspaceId} />
        </Grid>
      </Grid>
    </Container>
  );
}
