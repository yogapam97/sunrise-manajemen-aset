"use client";

import { useState } from "react";

import {
  Grid,
  Card,
  Stack,
  Button,
  Dialog,
  Container,
  Typography,
  DialogContent,
} from "@mui/material";

import { paths } from "src/routes/paths";
import { RouterLink } from "src/routes/components";

import { useBoolean } from "src/hooks/use-boolean";

import Iconify from "src/components/iconify";
import { useSettingsContext } from "src/components/settings";
import PageHeader from "src/components/sunrise/common/PageHeader";
import { ASSIGNMENT_ICON } from "src/components/sunrise/core/icon-definitions";
import OperationLogTableContainer from "src/components/sunrise/container/operation-log/OperationLogTableContainer";

type WorkspaceListViewProps = {
  workspaceId: string;
};

export default function AssignmentListView({ workspaceId }: WorkspaceListViewProps) {
  const settings = useSettingsContext();
  const [filter, setFilter] = useState({ operation_type: ["ASSIGNMENT"] });
  const operationLogFullScreen = useBoolean();

  return (
    <Container maxWidth={settings.themeStretch ? false : "xl"}>
      <PageHeader
        heading={
          <Stack direction="row" alignItems="center" spacing={1}>
            <Iconify icon={ASSIGNMENT_ICON} />
            <Typography variant="h5">Assignment</Typography>
          </Stack>
        }
        action={
          <Button
            component={RouterLink}
            href={paths.app.assignment.create(workspaceId)}
            variant="contained"
            startIcon={<Iconify icon="mdi:plus" />}
          >
            Add Assignment
          </Button>
        }
      />
      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={12} md={12}>
          <OperationLogTableContainer
            workspaceId={workspaceId}
            onFullScreen={operationLogFullScreen.onTrue}
            filter={filter}
            onFilter={(newFilter: any) =>
              setFilter({ ...newFilter, operation_type: ["ASSIGNMENT"] })
            }
            config={{
              showFilterOperationGroup: true,
              showFilterAssignment: true,
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
              onFilter={(newFilter: any) =>
                setFilter({ ...newFilter, operation_type: ["ASSIGNMENT"] })
              }
              config={{
                hideFullScreen: true,
                showFilterOperationGroup: true,
                showFilterAssignment: true,
              }}
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
