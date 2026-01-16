"use client";

import { useState } from "react";

import {
  Grid,
  Card,
  Stack,
  Dialog,
  Button,
  Container,
  Typography,
  DialogContent,
} from "@mui/material";

import { useBoolean } from "src/hooks/use-boolean";

import Iconify from "src/components/iconify";
import { useSettingsContext } from "src/components/settings";
import PageHeader from "src/components/sunrise/common/PageHeader";
import { OPERATION_LOG_ICON } from "src/components/sunrise/core/icon-definitions";
import OperationLogTableContainer from "src/components/sunrise/container/operation-log/OperationLogTableContainer";

type WorkspaceListViewProps = {
  workspaceId: string;
};

export default function OperationLogListView({ workspaceId }: WorkspaceListViewProps) {
  const settings = useSettingsContext();
  const [filter, setFilter] = useState({});
  const operationLogFullScreen = useBoolean();

  return (
    <Container maxWidth={settings.themeStretch ? false : "xl"}>
      <PageHeader
        heading={
          <Stack direction="row" alignItems="center" spacing={1}>
            <Iconify icon={OPERATION_LOG_ICON} />
            <Typography variant="h5">Operation Log</Typography>
          </Stack>
        }
      />
      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={12} md={12}>
          <OperationLogTableContainer
            workspaceId={workspaceId}
            filter={filter}
            onFilter={setFilter}
            onFullScreen={operationLogFullScreen.onTrue}
            config={{
              showFilterOperationGroup: true,
              showFilterOperationType: true,
              showFilterAudit: true,
              showFilterAssignment: true,
              showFilterRelocation: true,
              showFilterTransition: true,
            }}
          />
        </Grid>
      </Grid>

      <Dialog
        fullScreen
        open={operationLogFullScreen.value}
        onClose={operationLogFullScreen.onFalse}
      >
        <DialogContent sx={{ p: 2 }}>
          <Card sx={{ p: 2 }}>
            <OperationLogTableContainer
              workspaceId={workspaceId}
              filter={filter}
              onFilter={setFilter}
              config={{ hideFullScreen: true }}
            />
          </Card>
        </DialogContent>
        <Button
          aria-label="close"
          onClick={operationLogFullScreen.onFalse}
          variant="outlined"
          sx={{
            position: "absolute",
            right: 20,
            top: 8,
            color: (theme: any) => theme.palette.grey[500],
          }}
          startIcon={<Iconify icon="solar:close-circle-outline" />}
        >
          Close
        </Button>
      </Dialog>
    </Container>
  );
}
