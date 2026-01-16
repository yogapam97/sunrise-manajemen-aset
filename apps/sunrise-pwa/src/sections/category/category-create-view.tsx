"use client";

import nProgress from "nprogress";
import { useRouter } from "next/navigation";

import { Grid, Container } from "@mui/material";

import { paths } from "src/routes/paths";

import { useSettingsContext } from "src/components/settings";
import PageHeader from "src/components/sunrise/common/PageHeader";
import CategoryCreateFormContainer from "src/components/sunrise/container/category/CategoryCreateFormContainer";

type CategoryCreateViewProps = {
  workspaceId: string;
};
export default function CategoryCreateView({ workspaceId }: CategoryCreateViewProps) {
  const settings = useSettingsContext();
  const { push } = useRouter();

  const handleSuccess = () => {
    nProgress.start();
    push(paths.app.category.root(workspaceId));
  };

  return (
    <Container maxWidth={settings.themeStretch ? false : "xl"}>
      <PageHeader withBackButton />
      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={12} md={4}>
          <CategoryCreateFormContainer workspaceId={workspaceId} onSuccess={handleSuccess} />
        </Grid>
      </Grid>
    </Container>
  );
}
