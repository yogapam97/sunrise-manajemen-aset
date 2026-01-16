"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  Box,
  Card,
  Grid,
  Alert,
  Stack,
  Button,
  ListItem,
  Container,
  Typography,
  CardContent,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

import { paths } from "src/routes/paths";
import { RouterLink } from "src/routes/components";

import { useBoolean } from "src/hooks/use-boolean";

import Iconify from "src/components/iconify";
import { useSettingsContext } from "src/components/settings";
import { LoadingScreen } from "src/components/loading-screen";
import { useSelectWorkspace } from "src/components/sunrise/hook/useWorkspaces";
import WorkspaceLogo from "src/components/sunrise/core/workspace/WorkspaceLogo";
import NavSectionVertical from "src/components/nav-section/vertical/nav-section-vertical";
import WorkspaceDeleteDialog from "src/components/sunrise/core/workspace/WorkspaceDeleteDialog";
import {
  EMPTY_ICON,
  MEMBER_ICON,
  DASHBOARD_ICON,
  FIXED_ASSET_ICON,
} from "src/components/sunrise/core/icon-definitions";

import { useWorkspaceContext } from "src/auth/hooks";

type WorkspaceDetailViewProps = {
  workspaceId: string;
};
const defaultConfig = {
  itemGap: 4,
  iconSize: 24,
  currentRole: "admin",
  itemRootHeight: 44,
  itemSubHeight: 36,
  itemPadding: "4px 8px 4px 12px",
  itemRadius: 8,
  hiddenLabel: false,
};

const NAV_ITEMS = (workspaceId: string) => [
  {
    subheader: "Workspace",
    items: [
      {
        title: "Dashboard",
        path: paths.app.dashboard.root(workspaceId),
        icon: <Iconify icon={DASHBOARD_ICON} />,
        roles: ["admin", "user"],
        caption: "View your current fixed asset state",
      },
      {
        title: "Fixed Asset",
        path: paths.app.fixedAsset.root(workspaceId),
        icon: <Iconify icon={FIXED_ASSET_ICON} />,
        roles: ["admin", "user"],
        caption: "Start managing your fixed asset",
      },
      {
        title: "Member",
        path: paths.app.member.root(workspaceId),
        icon: <Iconify icon={MEMBER_ICON} />,
        roles: ["admin"],
        caption: "Start managing your member",
      },
    ],
  },
];
export default function WorkspaceDetailView({ workspaceId }: WorkspaceDetailViewProps) {
  const settings = useSettingsContext();
  const { push } = useRouter();
  const { setWorkspace, workspace } = useWorkspaceContext();
  const [selectedWorkspace, setSelectedWorkspace] = useState<any>(null);
  const workspaceDeleteDialog = useBoolean();
  const { isLoading } = useSelectWorkspace(workspaceId, {
    onSuccess: async (response: any) => {
      await setWorkspace(response.data);
      setSelectedWorkspace(response.data);
    },
  });

  if (isLoading) {
    return <LoadingScreen height="50vh" message="Loading Workspace ..." />;
  }

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : "lg"}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Button
              onClick={() => push(paths.workspace.root)}
              startIcon={<Iconify icon="eva:chevron-left-outline" />}
            >
              My Workspace
            </Button>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 2 }} variant="outlined">
              <Stack spacing={2}>
                <Box sx={{ width: "100%", height: 250, display: "flex", justifyContent: "center" }}>
                  <WorkspaceLogo
                    workspace={workspace}
                    sx={{ borderRadius: "2%", height: 250, width: 250 }}
                  />
                </Box>
                <CardContent>
                  <Stack>
                    <ListItemText
                      primary={<Typography variant="h6">{selectedWorkspace?.name}</Typography>}
                      secondary={
                        <Typography variant="caption">{`ID: ${selectedWorkspace?.id}`}</Typography>
                      }
                    />
                  </Stack>
                  <Stack sx={{ mt: 2 }}>
                    <Typography variant="subtitle2">Owner</Typography>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon>
                        <Iconify icon="mdi:person-star-outline" />
                      </ListItemIcon>
                      <ListItemText
                        primary={selectedWorkspace?.created_by?.name}
                        secondary={selectedWorkspace?.created_by?.email}
                      />
                    </ListItem>
                  </Stack>
                  <Typography variant="subtitle2">Currency</Typography>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon>
                      <Iconify icon="tabler:cash-banknote" />
                    </ListItemIcon>
                    <ListItemText
                      primary={selectedWorkspace?.currency?.name}
                      secondary={selectedWorkspace?.currency?.symbol}
                    />
                  </ListItem>
                  <Stack spacing={1} sx={{ mt: 2 }}>
                    <Typography variant="subtitle2">Contact</Typography>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon>
                        <Iconify icon="mdi:email-outline" />
                      </ListItemIcon>
                      <ListItemText
                        primary={selectedWorkspace?.email || <Iconify icon={EMPTY_ICON} />}
                      />
                    </ListItem>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon>
                        <Iconify icon="mdi:phone-outline" />
                      </ListItemIcon>
                      <ListItemText
                        primary={selectedWorkspace?.phone || <Iconify icon={EMPTY_ICON} />}
                      />
                    </ListItem>
                    <Stack spacing={1}>
                      <Typography variant="subtitle2">Description</Typography>
                      <Typography variant="caption">
                        {selectedWorkspace?.description || "-"}
                      </Typography>
                    </Stack>
                  </Stack>
                </CardContent>
                <Button
                  variant="contained"
                  component={RouterLink}
                  href={paths.workspace.edit(workspaceId)}
                >
                  Edit Workspace
                </Button>
              </Stack>
            </Card>
          </Grid>
          <Grid item xs={12} md={8}>
            <Card sx={{ p: 2 }} variant="outlined">
              <NavSectionVertical
                data={NAV_ITEMS(workspaceId)}
                config={defaultConfig}
                sx={{
                  borderRadius: 2,
                  bgcolor: "background.paper",
                }}
              />
              {!isLoading && selectedWorkspace?.invitation_status === "mastered" && (
                <Stack spacing={2} sx={{ mt: 2 }}>
                  <Alert severity="error">Danger Zone</Alert>
                  <Box>
                    <Button variant="outlined" color="error" onClick={workspaceDeleteDialog.onTrue}>
                      Delete Workspace
                    </Button>
                  </Box>
                  <Typography variant="body2">
                    Deleting this workspace will permanently delete all of its data, including fixed
                    asset, repository, and other related data. This action cannot be undone.
                  </Typography>
                </Stack>
              )}
            </Card>
          </Grid>
        </Grid>
      </Container>
      <WorkspaceDeleteDialog
        workspace={workspace}
        open={workspaceDeleteDialog.value}
        onClose={workspaceDeleteDialog.onFalse}
        onDeleted={() => push(paths.workspace.root)}
      />
    </>
  );
}
