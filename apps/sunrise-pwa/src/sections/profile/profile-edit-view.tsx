"use client";

import nProgress from "nprogress";
import { useRouter } from "next/navigation";

import { Grid, Container } from "@mui/material";

import { paths } from "src/routes/paths";

import { useSettingsContext } from "src/components/settings";
import ProfileFormContainer from "src/components/sunrise/container/auth/ProfileFormContainer";

export default function ProfileEditView() {
  const settings = useSettingsContext();
  const { push } = useRouter();

  const handleSuccessUpdate = () => {
    nProgress.start();
    push(paths.profile.root);
  };

  return (
    <Container maxWidth={settings.themeStretch ? false : "lg"}>
      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={12} md={12}>
          <ProfileFormContainer onSuccess={handleSuccessUpdate} />
        </Grid>
      </Grid>
    </Container>
  );
}
