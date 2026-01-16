"use client";

import type { SyntheticEvent } from "react";

import { useState } from "react";

import { TabList, TabContext } from "@mui/lab";
import { Box, Tab, Grid, Stack, Button, Container, Typography } from "@mui/material";

import { paths } from "src/routes/paths";
import { RouterLink } from "src/routes/components";

import { useBoolean } from "src/hooks/use-boolean";

import Iconify from "src/components/iconify";
import { useSettingsContext } from "src/components/settings";
import PageHeader from "src/components/sunrise/common/PageHeader";
import { MAINTENANCE_ICON } from "src/components/sunrise/core/icon-definitions";
import CommonFullScreenDialog from "src/components/sunrise/core/common/CommonFullScreenDialog";
import MaintenanceTableContainer from "src/components/sunrise/container/maintenance/MaintenanceTableContainer";
import FixedAssetMaintenanceTableContainer from "src/components/sunrise/container/fixed-asset/FixedAssetMaintenanceTableContainer";

type MaintenanceListViewProps = {
  workspaceId: string;
};

const MaintenanceTableContainerConfig = ({ workspaceId, filter, setFilter, onFullScreen }: any) => (
  <MaintenanceTableContainer
    workspaceId={workspaceId}
    filter={filter}
    onFilter={setFilter}
    onFullScreen={onFullScreen}
    config={{
      showFilterOperationGroup: true,
      showFilterMaintenance: true,
      hideFullScreen: !onFullScreen,
    }}
  />
);

const FixedAssetMaintenanceTableContainerConfig = ({
  workspaceId,
  filter,
  onFilter,
  onFullScreen,
}: any) => (
  <FixedAssetMaintenanceTableContainer
    workspaceId={workspaceId}
    filter={filter}
    onFilter={onFilter}
    onFullScreen={onFullScreen}
    config={{
      hideFullScreen: !onFullScreen,
    }}
  />
);

export default function MaintenanceListView({ workspaceId }: MaintenanceListViewProps) {
  const settings = useSettingsContext();
  const [filter, setFilter] = useState({});
  const [tabValue, setValue] = useState("fixed-asset");
  const maintenanceFullScreen = useBoolean();
  const fixedAssetMaintenanceTableFullScreen = useBoolean();
  const handleChangeTab = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <Container maxWidth={settings.themeStretch ? false : "xl"}>
      <PageHeader
        heading={
          <Stack direction="row" alignItems="center" spacing={1}>
            <Iconify icon={MAINTENANCE_ICON} />
            <Typography variant="h5">Maintenance</Typography>
          </Stack>
        }
        action={
          <Button
            component={RouterLink}
            href={paths.app.maintenance.create(workspaceId)}
            variant="contained"
            startIcon={<Iconify icon="mdi:plus" />}
          >
            Add Maintenance
          </Button>
        }
      />
      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={12} md={12}>
          <TabContext value={tabValue}>
            <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 1 }}>
              <TabList onChange={handleChangeTab} aria-label="lab API tabs example">
                <Tab label="Fixed Asset" value="fixed-asset" />
                <Tab label="History Log" value="maintenance-log" />
              </TabList>
            </Box>
          </TabContext>
          {tabValue === "fixed-asset" && (
            <FixedAssetMaintenanceTableContainerConfig
              workspaceId={workspaceId}
              filter={filter}
              onFilter={setFilter}
              onFullScreen={fixedAssetMaintenanceTableFullScreen.onTrue}
            />
          )}
          {tabValue === "maintenance-log" && (
            <MaintenanceTableContainerConfig
              workspaceId={workspaceId}
              filter={filter}
              setFilter={setFilter}
              onFullScreen={maintenanceFullScreen.onTrue}
            />
          )}
        </Grid>
      </Grid>
      <CommonFullScreenDialog
        open={fixedAssetMaintenanceTableFullScreen.value}
        onClose={fixedAssetMaintenanceTableFullScreen.onFalse}
      >
        <FixedAssetMaintenanceTableContainerConfig
          workspaceId={workspaceId}
          filter={filter}
          onFilter={setFilter}
        />
      </CommonFullScreenDialog>
      <CommonFullScreenDialog
        open={maintenanceFullScreen.value}
        onClose={maintenanceFullScreen.onFalse}
      >
        <MaintenanceTableContainerConfig
          workspaceId={workspaceId}
          filter={filter}
          setFilter={setFilter}
        />
      </CommonFullScreenDialog>
    </Container>
  );
}
