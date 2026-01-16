"use client";

import type { IMemberItem } from "src/types/member";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { TabList, TabContext } from "@mui/lab";
import { Box, Tab, Card, Grid, Container } from "@mui/material";

import { getMemberById } from "src/api/member-api";

import { useSettingsContext } from "src/components/settings";
import { LoadingScreen } from "src/components/loading-screen";
import PageHeader from "src/components/sunrise/common/PageHeader";
import MemberDetailTable from "src/components/sunrise/core/member/MemberDetailTable";
import MemberListItemText from "src/components/sunrise/core/member/MemberListItemText";
import FixedAssetTableContainer from "src/components/sunrise/container/fixed-asset/FixedAssetTableContainer";
import DepreciationTableContainer from "src/components/sunrise/container/depreciation/DepreciationTableContainer";

type MemberDetailViewProps = {
  memberId: string;
  workspaceId: string;
};

export default function MemberDetailView({ memberId, workspaceId }: MemberDetailViewProps) {
  let member: IMemberItem = {} as IMemberItem;
  const [tabValue, setTabValue] = useState("detail");

  const settings = useSettingsContext();
  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
  };

  const {
    data,
    isLoading: memberLoading,
    isSuccess,
  } = useQuery({
    queryKey: ["categories", memberId],
    queryFn: () => getMemberById(memberId),
  });

  if (isSuccess) {
    ({ data: member } = data);
  }

  if (memberLoading) {
    return <LoadingScreen height="50vh" message="Loading Member ..." />;
  }

  return (
    <Container maxWidth={settings.themeStretch ? false : "xl"}>
      <PageHeader withBackButton />
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
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Card sx={{ py: 2 }} elevation={0}>
                    <MemberListItemText avatarSize={{ width: 72, height: 72 }} member={member} />
                  </Card>
                </Grid>
                <Grid item xs={12} md={8}>
                  <Card>
                    <MemberDetailTable workspaceId={workspaceId} member={member} />
                  </Card>
                </Grid>
              </Grid>
            )}
            {tabValue === "fixedAsset" && (
              <FixedAssetTableContainer
                workspaceId={workspaceId}
                filter={{ assignee: [memberId] }}
                config={{ hideImport: true, hideFilter: true, hideFullScreen: true }}
              />
            )}
            {tabValue === "depreciation" && (
              <DepreciationTableContainer
                workspaceId={workspaceId}
                filter={{ assignee: [memberId] }}
                config={{ hideFilter: true }}
              />
            )}
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}
