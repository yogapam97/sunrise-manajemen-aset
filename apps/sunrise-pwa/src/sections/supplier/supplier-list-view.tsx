"use client";

import { Grid, Stack, Button, Container, Typography } from "@mui/material";

import { paths } from "src/routes/paths";
import { RouterLink } from "src/routes/components";

import Iconify from "src/components/iconify";
import { useSettingsContext } from "src/components/settings";
import PageHeader from "src/components/sunrise/common/PageHeader";
import SupplierIcon from "src/components/sunrise/core/supplier/SupplierIcon";
import SupplierTableContainer from "src/components/sunrise/container/supplier/SupplierTableContainer";

type WorkspaceListViewProps = {
  workspaceId: string;
};

export default function SupplierListView({ workspaceId }: WorkspaceListViewProps) {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : "xl"}>
      <PageHeader
        heading={
          <Stack direction="row" alignItems="center" spacing={1}>
            <SupplierIcon />
            <Typography variant="h5">Supplier</Typography>
          </Stack>
        }
        action={
          <Button
            component={RouterLink}
            href={paths.app.supplier.create(workspaceId)}
            variant="contained"
            startIcon={<Iconify icon="mdi:plus" />}
          >
            Add Supplier
          </Button>
        }
      />
      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={12} md={12}>
          <SupplierTableContainer workspaceId={workspaceId} />
        </Grid>
      </Grid>
    </Container>
  );
}
