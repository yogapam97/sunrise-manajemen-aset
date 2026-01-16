"use client";

import { useState } from "react";

import { Grid, Stack, Container, Typography } from "@mui/material";

import Iconify from "src/components/iconify/iconify";
import { useSettingsContext } from "src/components/settings";
import PageHeader from "src/components/sunrise/common/PageHeader";
import { DEPRECIATION_ICON } from "src/components/sunrise/core/icon-definitions";
import DepreciationTableContainer from "src/components/sunrise/container/depreciation/DepreciationTableContainer";

type DepreciationListViewProps = {
  workspaceId: string;
};

export default function DepreciationListView({ workspaceId }: DepreciationListViewProps) {
  const settings = useSettingsContext();
  const [filter, setFilter] = useState({});

  return (
    <Container maxWidth={settings.themeStretch ? false : "xl"}>
      <PageHeader
        heading={
          <Stack direction="row" alignItems="center" spacing={1}>
            <Iconify icon={DEPRECIATION_ICON} />
            <Typography variant="h5">Depreciation</Typography>
          </Stack>
        }
      />
      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={12} md={12}>
          <DepreciationTableContainer
            filter={filter}
            onFilter={setFilter}
            workspaceId={workspaceId}
          />
        </Grid>
      </Grid>
    </Container>
  );
}
