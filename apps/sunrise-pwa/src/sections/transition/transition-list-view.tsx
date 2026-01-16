"use client";

import { useState } from "react";

import { Grid, Stack, Button, Container, Typography } from "@mui/material";

import { paths } from "src/routes/paths";
import { RouterLink } from "src/routes/components";

import { useBoolean } from "src/hooks/use-boolean";

import Iconify from "src/components/iconify";
import { useSettingsContext } from "src/components/settings";
import PageHeader from "src/components/sunrise/common/PageHeader";
import { TRANSITION_ICON } from "src/components/sunrise/core/icon-definitions";
import CommonFullScreenDialog from "src/components/sunrise/core/common/CommonFullScreenDialog";
import OperationLogTableContainer from "src/components/sunrise/container/operation-log/OperationLogTableContainer";

type WorkspaceListViewProps = {
  workspaceId: string;
};

type OperationLogTableContainerConfigProps = {
  workspaceId: string;
  filter: any;
  setFilter: any;
  onFullScreen?: any;
};
const OperationLogTableContainerConfig = ({
  workspaceId,
  filter,
  setFilter,
  onFullScreen,
}: OperationLogTableContainerConfigProps) => (
  <OperationLogTableContainer
    workspaceId={workspaceId}
    filter={filter}
    onFilter={(newFilter: any) => setFilter({ ...newFilter, operation_type: ["TRANSITION"] })}
    onFullScreen={onFullScreen}
    config={{
      showFilterOperationGroup: true,
      showFilterTransition: true,
      hideFullScreen: !onFullScreen,
    }}
  />
);

export default function TransitionListView({ workspaceId }: WorkspaceListViewProps) {
  const settings = useSettingsContext();
  const [filter, setFilter] = useState({ operation_type: ["TRANSITION"] });
  const operationLogFullScreen = useBoolean();

  return (
    <Container maxWidth={settings.themeStretch ? false : "xl"}>
      <PageHeader
        heading={
          <Stack direction="row" alignItems="center" spacing={1}>
            <Iconify icon={TRANSITION_ICON} />
            <Typography variant="h5">Transition</Typography>
          </Stack>
        }
        action={
          <Button
            component={RouterLink}
            href={paths.app.transition.create(workspaceId)}
            variant="contained"
            startIcon={<Iconify icon="mdi:plus" />}
          >
            Add Transition
          </Button>
        }
      />
      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={12} md={12}>
          <OperationLogTableContainerConfig
            workspaceId={workspaceId}
            filter={filter}
            setFilter={setFilter}
            onFullScreen={operationLogFullScreen.onTrue}
          />
        </Grid>
      </Grid>
      <CommonFullScreenDialog
        open={operationLogFullScreen.value}
        onClose={operationLogFullScreen.onFalse}
      >
        <OperationLogTableContainerConfig
          workspaceId={workspaceId}
          filter={filter}
          setFilter={setFilter}
        />
      </CommonFullScreenDialog>
    </Container>
  );
}
