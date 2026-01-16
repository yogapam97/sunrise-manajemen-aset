"use client";

// @mui
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";

// routes
import { paths } from "src/routes/paths";
import { RouterLink } from "src/routes/components";

// components
import Iconify from "src/components/iconify";
import { useSettingsContext } from "src/components/settings";
import PageHeader from "src/components/sunrise/common/PageHeader";
//
import WorkspaceIconText from "src/components/sunrise/core/workspace/WorkspaceIconText";
// types
import WorkspaceListTabContainer from "src/components/sunrise/container/workspace/WorkspaceListTabContainer";
// ----------------------------------------------------------------------

export default function WorkspaceListView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : "lg"}>
      <PageHeader
        heading={<WorkspaceIconText variant="h6" />}
        action={
          <Button
            component={RouterLink}
            href={paths.workspace.create}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            New Workspace
          </Button>
        }
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <WorkspaceListTabContainer />
    </Container>
  );
}
