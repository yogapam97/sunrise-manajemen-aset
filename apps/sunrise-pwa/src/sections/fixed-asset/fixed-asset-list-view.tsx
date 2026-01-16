"use client";

import { useState } from "react";

import { Grid, Stack, Button, Container, Typography } from "@mui/material";

import { paths } from "src/routes/paths";
import { RouterLink } from "src/routes/components";

import { useBoolean } from "src/hooks/use-boolean";

import Iconify from "src/components/iconify/iconify";
import { useSettingsContext } from "src/components/settings";
import PageHeader from "src/components/sunrise/common/PageHeader";
import { FIXED_ASSET_ICON } from "src/components/sunrise/core/icon-definitions";
import CommonFullScreenDialog from "src/components/sunrise/core/common/CommonFullScreenDialog";
import FixedAssetTableContainer from "src/components/sunrise/container/fixed-asset/FixedAssetTableContainer";

type FixedAssetListViewProps = {
  workspaceId: string;
};

type FixedAssetTableContainerConfigProps = {
  workspaceId: string;
  filter: any;
  setFilter: any;
  onFullScreen?: any;
};
const FixedAssetTableContainerConfig = ({
  workspaceId,
  filter,
  setFilter,
  onFullScreen,
}: FixedAssetTableContainerConfigProps) => (
  <FixedAssetTableContainer
    workspaceId={workspaceId}
    filter={filter}
    onFilter={setFilter}
    onFullScreen={onFullScreen}
    config={{
      hideFullScreen: !onFullScreen,
    }}
  />
);

export default function FixedAssetListView({ workspaceId }: FixedAssetListViewProps) {
  const settings = useSettingsContext();
  const [filter, setFilter] = useState({});
  const fixedAssetTableFullScreen = useBoolean();

  return (
    <Container maxWidth={settings.themeStretch ? false : "xl"}>
      <PageHeader
        heading={
          <Stack direction="row" alignItems="center" spacing={1}>
            <Iconify icon={FIXED_ASSET_ICON} />
            <Typography variant="h5">Fixed Asset</Typography>
          </Stack>
        }
        action={
          <Button
            component={RouterLink}
            href={paths.app.fixedAsset.create(workspaceId)}
            variant="contained"
            startIcon={<Iconify icon="mdi:plus" />}
          >
            Add Fixed Asset
          </Button>
        }
      />
      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={12} md={12}>
          <FixedAssetTableContainerConfig
            workspaceId={workspaceId}
            filter={filter}
            setFilter={setFilter}
            onFullScreen={fixedAssetTableFullScreen.onTrue}
          />
        </Grid>
      </Grid>

      <CommonFullScreenDialog
        open={fixedAssetTableFullScreen.value}
        onClose={fixedAssetTableFullScreen.onFalse}
      >
        <FixedAssetTableContainerConfig
          workspaceId={workspaceId}
          filter={filter}
          setFilter={setFilter}
        />
      </CommonFullScreenDialog>
    </Container>
  );
}
