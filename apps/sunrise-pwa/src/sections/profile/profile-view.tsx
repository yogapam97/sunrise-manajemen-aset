"use client";

import { useRouter } from "next/navigation";

import { Box, Grid, Alert, Stack, Button, Container, Typography } from "@mui/material";

import { useBoolean } from "src/hooks/use-boolean";

import { useSettingsContext } from "src/components/settings";
import PageHeader from "src/components/sunrise/common/PageHeader";
import ProfileCard from "src/components/sunrise/core/profile/ProfileCard";
import ProfileDeleteDialog from "src/components/sunrise/core/profile/ProfileDeleteDialog";

import { useAuthContext } from "src/auth/hooks";

export default function ProfileView() {
  const settings = useSettingsContext();
  const profileDeleteDialog = useBoolean();
  const router = useRouter();
  const { logout } = useAuthContext();
  const handleDeletedProfile = async () => {
    await logout();
    router.replace("/");
  };
  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : "lg"}>
        <PageHeader withBackButton />
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid xs={12} md={4} />
          <Grid item xs={12} md={4}>
            <ProfileCard />

            <Box sx={{ p: 2 }}>
              <Alert severity="error">Danger Zone</Alert>
              <Stack spacing={2} sx={{ mt: 2 }}>
                <Stack spacing={1}>
                  <Box>
                    <Button variant="outlined" color="error" onClick={profileDeleteDialog.onTrue}>
                      Delete Account
                    </Button>
                  </Box>

                  <Typography variant="body2">
                    WARNING: Deleting your account will result in the permanent removal of your
                    account, your workspace, and all associated data. Please be absolutely certain
                    before proceeding.
                  </Typography>
                </Stack>
              </Stack>
            </Box>
          </Grid>
        </Grid>
      </Container>
      <ProfileDeleteDialog
        open={profileDeleteDialog.value}
        onClose={profileDeleteDialog.onFalse}
        onDeleted={handleDeletedProfile}
      />
    </>
  );
}
