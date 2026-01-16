"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

import { Grid, Container } from "@mui/material";

import { paths } from "src/routes/paths";

import { useSettingsContext } from "src/components/settings";
import PageHeader from "src/components/sunrise/common/PageHeader";
import MemberEditFormContainer from "src/components/sunrise/container/member/MemberEditFormContainer";

type MemberEditViewProps = {
  workspaceId: string;
  memberId: string;
};

export default function MemberEditView({ workspaceId, memberId }: MemberEditViewProps) {
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
          <MemberEditFormContainer
            onSuccess={handleSuccess}
            workspaceId={workspaceId}
            memberId={memberId}
          />
        </Grid>
      </Grid>
    </Container>
  );
}
