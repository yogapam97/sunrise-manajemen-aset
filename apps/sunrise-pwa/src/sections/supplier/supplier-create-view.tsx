"use client";

import nProgress from "nprogress";
import { useRouter } from "next/navigation";

import { Grid, Container } from "@mui/material";

import { paths } from "src/routes/paths";

import { useSettingsContext } from "src/components/settings";
import PageHeader from "src/components/sunrise/common/PageHeader";
import SupplierCreateFormContainer from "src/components/sunrise/container/supplier/SupplierCreateFormContainer";

type SupplierCreateViewProps = {
  workspaceId: string;
};
export default function SupplierCreateView({ workspaceId }: SupplierCreateViewProps) {
  const settings = useSettingsContext();
  const { push } = useRouter();

  const handleSuccess = () => {
    nProgress.start();
    push(paths.app.supplier.root(workspaceId));
  };

  return (
    <Container maxWidth={settings.themeStretch ? false : "xl"}>
      <PageHeader withBackButton />
      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={12} md={4}>
          <SupplierCreateFormContainer workspaceId={workspaceId} onSuccess={handleSuccess} />
        </Grid>
      </Grid>
    </Container>
  );
}
