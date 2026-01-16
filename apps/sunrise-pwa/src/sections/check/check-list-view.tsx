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
import { CHECK_ICON } from "src/components/sunrise/core/icon-definitions";
import CheckTableContainer from "src/components/sunrise/container/check/CheckTableContainer";
import CommonFullScreenDialog from "src/components/sunrise/core/common/CommonFullScreenDialog";
import FixedAssetCheckTableContainer from "src/components/sunrise/container/fixed-asset/FixedAssetCheckTableContainer";

type CheckListViewProps = {
  workspaceId: string;
};

const CheckTableContainerConfig = ({ workspaceId, filter, setFilter, onFullScreen }: any) => (
  <CheckTableContainer
    workspaceId={workspaceId}
    filter={filter}
    onFilter={setFilter}
    onFullScreen={onFullScreen}
    config={{
      showFilterOperationGroup: true,
      showFilterCheck: true,
      hideFullScreen: !onFullScreen,
    }}
  />
);

const FixedAssetCheckTableContainerConfig = ({
  workspaceId,
  filter,
  onFilter,
  onFullScreen,
}: any) => (
  <FixedAssetCheckTableContainer
    workspaceId={workspaceId}
    filter={filter}
    onFilter={onFilter}
    onFullScreen={onFullScreen}
    config={{
      hideFullScreen: !onFullScreen,
    }}
  />
);

export default function CheckListView({ workspaceId }: CheckListViewProps) {
  const settings = useSettingsContext();
  const [filter, setFilter] = useState({});
  const [tabValue, setValue] = useState("fixed-asset");
  const checkFullScreen = useBoolean();
  const fixedAssetCheckTableFullScreen = useBoolean();
  const handleChangeTab = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <Container maxWidth={settings.themeStretch ? false : "xl"}>
      <PageHeader
        heading={
          <Stack direction="row" alignItems="center" spacing={1}>
            <Iconify icon={CHECK_ICON} />
            <Typography variant="h5">Check In/Out</Typography>
          </Stack>
        }
        action={
          <Button
            component={RouterLink}
            href={paths.app.check.create(workspaceId)}
            variant="contained"
            startIcon={<Iconify icon="mdi:plus" />}
          >
            Add Check In/Out
          </Button>
        }
      />
      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={12} md={12}>
          <TabContext value={tabValue}>
            <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 1 }}>
              <TabList onChange={handleChangeTab} aria-label="lab API tabs example">
                <Tab label="Fixed Asset" value="fixed-asset" />
                <Tab label="History Log" value="check-log" />
              </TabList>
            </Box>
          </TabContext>
          {tabValue === "fixed-asset" && (
            <FixedAssetCheckTableContainerConfig
              workspaceId={workspaceId}
              filter={filter}
              onFilter={setFilter}
              onFullScreen={fixedAssetCheckTableFullScreen.onTrue}
            />
          )}
          {tabValue === "check-log" && (
            <CheckTableContainerConfig
              workspaceId={workspaceId}
              filter={filter}
              setFilter={setFilter}
              onFullScreen={checkFullScreen.onTrue}
            />
          )}
        </Grid>
      </Grid>
      <CommonFullScreenDialog
        open={fixedAssetCheckTableFullScreen.value}
        onClose={fixedAssetCheckTableFullScreen.onFalse}
      >
        <FixedAssetCheckTableContainerConfig
          workspaceId={workspaceId}
          filter={filter}
          onFilter={setFilter}
        />
      </CommonFullScreenDialog>
      <CommonFullScreenDialog open={checkFullScreen.value} onClose={checkFullScreen.onFalse}>
        <CheckTableContainerConfig
          workspaceId={workspaceId}
          filter={filter}
          setFilter={setFilter}
        />
      </CommonFullScreenDialog>
    </Container>
  );
}
