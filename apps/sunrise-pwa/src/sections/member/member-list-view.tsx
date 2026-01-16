"use client";

import { Grid, Stack, Button, Container, Typography } from "@mui/material";

import { paths } from "src/routes/paths";
import { RouterLink } from "src/routes/components";

import Iconify from "src/components/iconify";
import { useSettingsContext } from "src/components/settings";
import PageHeader from "src/components/sunrise/common/PageHeader";
import { MEMBER_ICON } from "src/components/sunrise/core/icon-definitions";
import MemberTableContainer from "src/components/sunrise/container/member/MemberTableContainer";

type WorkspaceListViewProps = {
  workspaceId: string;
};

export default function MemberListView({ workspaceId }: WorkspaceListViewProps) {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : "xl"}>
      <PageHeader
        heading={
          <Stack direction="row" alignItems="center" spacing={1}>
            <Iconify icon={MEMBER_ICON} />
            <Typography variant="h5">Member</Typography>
          </Stack>
        }
        action={
          <Button
            component={RouterLink}
            href={paths.app.member.create(workspaceId)}
            variant="contained"
            startIcon={<Iconify icon="mdi:plus" />}
          >
            Add Member
          </Button>
        }
      />
      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={12} md={12}>
          <MemberTableContainer workspaceId={workspaceId} />
        </Grid>
      </Grid>
    </Container>
  );
}
