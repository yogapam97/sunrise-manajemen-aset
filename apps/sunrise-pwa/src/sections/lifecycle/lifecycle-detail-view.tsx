"use client";

import type { ILifecycleItem } from "src/types/lifecycle";

import { useRouter } from "next/navigation";
import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { TabList, TabContext } from "@mui/lab";
import { Box, Tab, Card, Grid, Button, Container, Typography } from "@mui/material";

import { paths } from "src/routes/paths";
import { RouterLink } from "src/routes/components";

import { useBoolean } from "src/hooks/use-boolean";

import { deleteLifecycle, getLifecycleIdById } from "src/api/lifecycle-api";

import { useSettingsContext } from "src/components/settings";
import { LoadingScreen } from "src/components/loading-screen";
import PageHeader from "src/components/sunrise/common/PageHeader";
import ConfirmDialog from "src/components/sunrise/common/dialog/ConfirmDialog";
import LifecycleDetailTable from "src/components/sunrise/core/lifecycle/LifecycleDetailTable";
import FixedAssetTableContainer from "src/components/sunrise/container/fixed-asset/FixedAssetTableContainer";
import DepreciationTableContainer from "src/components/sunrise/container/depreciation/DepreciationTableContainer";

import { useWorkspaceContext } from "src/auth/hooks";

type LifecycleDetailViewProps = {
  lifecycleId: string;
  workspaceId: string;
};

export default function LifecycleDetailView({
  lifecycleId,
  workspaceId,
}: LifecycleDetailViewProps) {
  let lifecycle: ILifecycleItem = {} as ILifecycleItem;
  const [tabValue, setTabValue] = useState("detail");

  const settings = useSettingsContext();
  const { workspace } = useWorkspaceContext();
  const deleteDialog = useBoolean();
  const { push } = useRouter();
  const queryClient = useQueryClient();
  const deleteConfirm = useBoolean();

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
  };

  const {
    data,
    isLoading: isDeleteLoading,
    isSuccess,
  } = useQuery({
    queryKey: ["categories", lifecycleId],
    queryFn: () => getLifecycleIdById(lifecycleId),
  });

  if (isSuccess) {
    ({ data: lifecycle } = data);
  }

  const { mutate, isLoading } = useMutation(() => deleteLifecycle(lifecycleId), {
    onSuccess: () => {
      push(`${paths.app.lifecycle.root(workspace?.id as string)}`);
      queryClient.invalidateQueries(["categories"]);
    },
  });

  const handleDeleteLifecycle = useCallback(() => {
    mutate();
    deleteDialog.onFalse();
  }, [mutate, deleteDialog]);

  if (isLoading || isDeleteLoading) {
    return <LoadingScreen height="50vh" message="Loading Lifecycle ..." />;
  }

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : "xl"}>
        <PageHeader
          withBackButton
          action={
            <Button
              variant="contained"
              component={RouterLink}
              href={paths.app.lifecycle.edit(workspace?.id as string, lifecycleId)}
            >
              Edit Lifecycle
            </Button>
          }
        />
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={12} md={12}>
            <TabContext value={tabValue}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <TabList onChange={handleTabChange}>
                  <Tab label="Detail" value="detail" />
                  <Tab label="Fixed Asset" value="fixedAsset" />
                  <Tab label="Depreciation" value="depreciation" />
                </TabList>
              </Box>
            </TabContext>
            <Box sx={{ mt: 1 }}>
              {tabValue === "detail" && (
                <Card>
                  <LifecycleDetailTable workspaceId={workspaceId} lifecycle={lifecycle} />
                </Card>
              )}
              {tabValue === "fixedAsset" && (
                <FixedAssetTableContainer
                  workspaceId={workspaceId}
                  filter={{ lifecycle: [lifecycleId] }}
                  config={{ hideImport: true, hideFilter: true, hideFullScreen: true }}
                />
              )}
              {tabValue === "depreciation" && (
                <DepreciationTableContainer
                  workspaceId={workspaceId}
                  filter={{ lifecycle: [lifecycleId] }}
                  config={{ hideFilter: true }}
                />
              )}
            </Box>
          </Grid>
        </Grid>
      </Container>
      <ConfirmDialog
        open={deleteConfirm.value}
        onClose={deleteConfirm.onFalse}
        title="Delete"
        content={
          <Box sx={{ color: "text.secondary" }}>
            <Typography variant="subtitle2">{lifecycle?.name}</Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Are you sure you want to delete this lifecycle?
            </Typography>
          </Box>
        }
        action={
          <Button variant="contained" color="error" onClick={handleDeleteLifecycle}>
            Delete
          </Button>
        }
      />
    </>
  );
}
