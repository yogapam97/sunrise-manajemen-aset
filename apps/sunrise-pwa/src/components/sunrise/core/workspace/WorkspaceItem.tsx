// @mui
import type { IWorkspaceItem } from "src/types/workspace";

import nProgress from "nprogress";
import { useRouter } from "next/navigation";
import { useState, useCallback } from "react";

import Link from "@mui/material/Link";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import { LoadingButton } from "@mui/lab";
import MenuItem from "@mui/material/MenuItem";
import { Button, Divider } from "@mui/material";
import ListItemText from "@mui/material/ListItemText";

// routes
import { paths } from "src/routes/paths";
import { RouterLink } from "src/routes/components";

import Label from "src/components/label";
// components
import Iconify from "src/components/iconify";
import CustomPopover, { usePopover } from "src/components/custom-popover";

import { useWorkspaceContext } from "src/auth/hooks";

import WorkspaceIcon from "./WorkspaceIcon";
import WorkspaceLogo from "./WorkspaceLogo";

// ----------------------------------------------------------------------

type Props = {
  workspace: IWorkspaceItem;
  onView: VoidFunction;
  onEdit: VoidFunction;
  onDelete: VoidFunction;
  onJoinWorkspace: (workspaceId: string) => void;
  onRejectWorkspace: (workspaceId: string) => void;
};

export default function WorkspaceItem({
  workspace,
  onView,
  onEdit,
  onDelete,
  onJoinWorkspace,
  onRejectWorkspace,
}: Props) {
  const popover = usePopover();
  const { push } = useRouter();
  const [openWorkspaceLoading, setOpenWorkspaceLoading] = useState<boolean>(false);
  const { setWorkspace } = useWorkspaceContext();
  const { invitation_status } = workspace;

  const handleOpenWorkspace = useCallback(() => {
    try {
      nProgress.start();
      setOpenWorkspaceLoading(true);
      setWorkspace(workspace);
      push(paths.app.dashboard.root(workspace.id as string));
    } catch {
      setOpenWorkspaceLoading(false);
    }
  }, [push, setWorkspace, workspace]);

  const { id, name, role } = workspace;

  return (
    <>
      <Card>
        <Label sx={{ position: "absolute", top: 8, right: 8 }}>{role}</Label>
        <Stack sx={{ p: 3 }}>
          <Stack direction="row" spacing={2} justifyContent="space-between">
            <WorkspaceLogo
              workspace={workspace}
              sx={{ width: 60, height: 60, borderRadius: "10%" }}
            />

            <ListItemText
              sx={{ mb: 1 }}
              primary={
                invitation_status === "pending" ? (
                  name
                ) : (
                  <Link
                    component={RouterLink}
                    href={paths.workspace.detail(id as string)}
                    color="inherit"
                  >
                    {name}
                  </Link>
                )
              }
            />
          </Stack>
        </Stack>
        <Divider />
        {["mastered", "accepted"].includes(invitation_status) && (
          <Stack direction="row" spacing={2} justifyContent="space-between" sx={{ p: 2 }}>
            <Button
              component={RouterLink}
              href={paths.workspace.detail(id as string)}
              variant="outlined"
              size="small"
              startIcon={<WorkspaceIcon />}
            >
              Detail
            </Button>
            <LoadingButton
              loading={openWorkspaceLoading}
              variant="contained"
              size="small"
              onClick={handleOpenWorkspace}
            >
              Open
            </LoadingButton>
          </Stack>
        )}
        {invitation_status === "pending" && (
          <Stack direction="row" spacing={2} justifyContent="space-between" sx={{ p: 2 }}>
            <LoadingButton
              loading={openWorkspaceLoading}
              variant="outlined"
              size="small"
              color="error"
              onClick={() => onRejectWorkspace(id as string)}
            >
              Reject
            </LoadingButton>

            <LoadingButton
              loading={openWorkspaceLoading}
              variant="contained"
              size="small"
              color="success"
              onClick={() => onJoinWorkspace(id as string)}
              startIcon={<WorkspaceIcon />}
            >
              Join
            </LoadingButton>
          </Stack>
        )}
      </Card>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem
          onClick={() => {
            popover.onClose();
            onView();
          }}
        >
          <Iconify icon="solar:eye-bold" />
          View
        </MenuItem>

        <MenuItem
          onClick={() => {
            popover.onClose();
            onEdit();
          }}
        >
          <Iconify icon="solar:pen-bold" />
          Edit
        </MenuItem>

        <MenuItem
          onClick={() => {
            popover.onClose();
            onDelete();
          }}
          sx={{ color: "error.main" }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem>
      </CustomPopover>
    </>
  );
}
