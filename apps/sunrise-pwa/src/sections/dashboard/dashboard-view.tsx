"use client";

// @mui
import Container from "@mui/material/Container";
import Grid from "@mui/material/Unstable_Grid2";

// hooks

// _mock
// assets

import { Button } from "@mui/material";

import { paths } from "src/routes/paths";
import { RouterLink } from "src/routes/components";

// components
import { useSettingsContext } from "src/components/settings";
import AppWelcome from "src/components/sunrise/core/dashboard/AppWelcome";
import DashboardTotalFixedAssetWidgetContainer from "src/components/sunrise/container/dashboard/DashboardTotalFixedAssetWidgetContainer";
import DashboardTotalPurchaseCostWidgetContainer from "src/components/sunrise/container/dashboard/DashboardTotalPurcaseCostWidgetContainer";
import DashboardTotalDepreciationWidgetContainer from "src/components/sunrise/container/dashboard/DashboardTotalDepreciationWidgetContainer";

import { useAuthContext } from "src/auth/hooks";

//

// ----------------------------------------------------------------------

type DashboardViewProps = {
  workspaceId: string;
};
export default function DashboardView({ workspaceId }: DashboardViewProps) {
  const { user } = useAuthContext();

  //   const theme = useTheme();

  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : "xl"}>
      <Grid container spacing={3}>
        <Grid xs={12} md={12}>
          <AppWelcome
            title={`Welcome back 👋 \n ${user?.name}`}
            description="Easily track, manage, and optimize your company's fixed assets. Keep up-to-date records and ensure compliance with streamlined asset management."
            img={<img alt="welcome" src="/assets/welcome.svg" height={200} />}
            action={
              <Button
                LinkComponent={RouterLink}
                href={paths.app.fixedAsset.root(workspaceId)}
                variant="contained"
                color="primary"
              >
                Manage Now
              </Button>
            }
          />
        </Grid>

        <Grid xs={12} md={4}>
          <DashboardTotalFixedAssetWidgetContainer workpaceId={workspaceId} />
        </Grid>

        <Grid xs={12} md={4}>
          <DashboardTotalPurchaseCostWidgetContainer workpaceId={workspaceId} />
        </Grid>

        <Grid xs={12} md={4}>
          <DashboardTotalDepreciationWidgetContainer workpaceId={workspaceId} />
        </Grid>
      </Grid>
    </Container>
  );
}
