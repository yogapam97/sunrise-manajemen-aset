"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

import { Grid, Container } from "@mui/material";

import { paths } from "src/routes/paths";

import { useSettingsContext } from "src/components/settings";
import PageHeader from "src/components/sunrise/common/PageHeader";
import MemberInviteFormContainer from "src/components/sunrise/container/member/MemberInviteFormContainer";

type MemberCreateViewProps = {
  workspaceId: string;
};

export default function MemberCreateView({ workspaceId }: MemberCreateViewProps) {
  const settings = useSettingsContext();
  const { push } = useRouter();

  const queryClient = useQueryClient();
  const handleSuccess = useCallback(() => {
    push(`${paths.app.member.root(workspaceId)}`);
    queryClient.invalidateQueries(["members"]);
  }, [push, queryClient, workspaceId]);

  return (
    <Container maxWidth={settings.themeStretch ? false : "xl"}>
      <PageHeader withBackButton />
      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={12} md={4}>
          <MemberInviteFormContainer onSuccess={handleSuccess} workspaceId={workspaceId} />
        </Grid>
      </Grid>
    </Container>
  );
}
