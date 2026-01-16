"use client";

import nProgress from "nprogress";
import { useRouter } from "next/navigation";

import { Grid, Container } from "@mui/material";

import { paths } from "src/routes/paths";

import { useSettingsContext } from "src/components/settings";
import PageHeader from "src/components/sunrise/common/PageHeader";
import LocationCreateFormContainer from "src/components/sunrise/container/location/LocationCreateFormContainer";

type LocationCreateViewProps = {
  workspaceId: string;
};
export default function LocationCreateView({ workspaceId }: LocationCreateViewProps) {
  const settings = useSettingsContext();
  const { push } = useRouter();

  const handleSuccess = () => {
    nProgress.start();
    push(paths.app.location.root(workspaceId));
  };

  return (
    <Container maxWidth={settings.themeStretch ? false : "xl"}>
      <PageHeader withBackButton />
      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={12} md={4}>
          <LocationCreateFormContainer workspaceId={workspaceId} onSuccess={handleSuccess} />
        </Grid>
      </Grid>
    </Container>
  );
}
