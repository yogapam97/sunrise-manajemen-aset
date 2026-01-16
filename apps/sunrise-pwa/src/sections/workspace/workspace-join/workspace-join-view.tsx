"use client";

import type { IWorkspaceItem } from "src/types/workspace";

import { useQuery } from "@tanstack/react-query";

import { Grid, Container } from "@mui/material";

import { getWorkspaceById } from "src/api/workspace-api";

import { useSettingsContext } from "src/components/settings";
import { LoadingScreen } from "src/components/loading-screen";
import WorkspaceItemJoinConfirmation from "src/components/sunrise/core/workspace/WorkspaceItemJoinConfirmation";

type WorkspaceJoinViewProps = {
  workspaceId: string;
};

export default function WorkspaceJoinView({ workspaceId }: WorkspaceJoinViewProps) {
  let workspace: IWorkspaceItem = {
    id: "id",
    name: "name",
    role: "role",
    currency: null,
    description: "description",
    created_at: new Date(),
    members_count: 0,
    logo: "logo",
    created_by: new Date(),
    invitation_status: "invitation_status",
    time_zone: "time_zone",
  };

  const settings = useSettingsContext();
  const { data, isLoading, isSuccess } = useQuery({
    queryKey: ["workspace"],
    queryFn: () => getWorkspaceById(workspaceId),
  });

  if (isSuccess) {
    ({ data: workspace } = data);
  }

  return (
    <Container maxWidth={settings.themeStretch ? false : "xl"}>
      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={4} md={4} />
        <Grid item xs={4} md={4}>
          {isLoading ? <LoadingScreen /> : <WorkspaceItemJoinConfirmation workspace={workspace} />}
        </Grid>
      </Grid>
    </Container>
  );
}
