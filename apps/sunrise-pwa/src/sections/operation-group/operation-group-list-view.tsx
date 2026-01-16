"use client";

import { useState } from "react";

import { Grid, Stack, Button, Container, Typography } from "@mui/material";

import { paths } from "src/routes/paths";
import { RouterLink } from "src/routes/components";

import Iconify from "src/components/iconify";
import { useSettingsContext } from "src/components/settings";
import PageHeader from "src/components/sunrise/common/PageHeader";
import { OPERATION_GROUP_ICON } from "src/components/sunrise/core/icon-definitions";
import OperationGroupTableContainer from "src/components/sunrise/container/operation-group/OperationGroupTableContainer";

type WorkspaceListViewProps = {
  workspaceId: string;
};

export default function OperationGroupListView({ workspaceId }: WorkspaceListViewProps) {
  const settings = useSettingsContext();
  const [filter, setFilter] = useState({});

  return (
    <Container maxWidth={settings.themeStretch ? false : "xl"}>
      <PageHeader
        heading={
          <Stack direction="row" alignItems="center" spacing={1}>
            <Iconify icon={OPERATION_GROUP_ICON} />
            <Typography variant="h5">Operation Group</Typography>
          </Stack>
        }
        action={
          <Button
            component={RouterLink}
            href={paths.app.operationGroup.create(workspaceId)}
            variant="contained"
            startIcon={<Iconify icon="mdi:plus" />}
          >
            Add Operation Group
          </Button>
        }
      />
      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={12} md={12}>
          <OperationGroupTableContainer
            workspaceId={workspaceId}
            filter={filter}
            onFilter={setFilter}
          />
        </Grid>
      </Grid>
    </Container>
  );
}
