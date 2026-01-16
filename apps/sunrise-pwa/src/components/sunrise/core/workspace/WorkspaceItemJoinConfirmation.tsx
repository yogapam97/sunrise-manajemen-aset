// @mui
import type { IWorkspaceItem } from "src/types/workspace";

import { useRouter } from "next/navigation";
import { useState, useCallback } from "react";

import Link from "@mui/material/Link";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import { LoadingButton } from "@mui/lab";
import { Button, Divider } from "@mui/material";
import ListItemText from "@mui/material/ListItemText";

// routes
import { paths } from "src/routes/paths";
// components
import { RouterLink } from "src/routes/components";

import Label from "src/components/label";

import { useWorkspaceContext } from "src/auth/hooks";

import WorkspaceIcon from "./WorkspaceIcon";
import WorkspaceLogo from "./WorkspaceLogo";

// ----------------------------------------------------------------------

type Props = {
  workspace: IWorkspaceItem;
};

export default function WorkspaceItemJoinConfirmation({ workspace }: Props) {
  const { push } = useRouter();
  const [openWorkspaceLoading, setOpenWorkspaceLoading] = useState<boolean>(false);
  const { setWorkspace } = useWorkspaceContext();

  const handleOpenWorkspace = useCallback(() => {
    try {
      setOpenWorkspaceLoading(true);
      setWorkspace(workspace);
      push(paths.app.location.root(workspace.id as string));
    } catch {
      setOpenWorkspaceLoading(false);
    }
  }, [push, setWorkspace, workspace]);

  const { id, name } = workspace;

  return (
    <Card>
      <Label sx={{ position: "absolute", top: 8, right: 8 }}>Admin</Label>
      <Stack sx={{ p: 3 }}>
        <Stack direction="row" spacing={2} justifyContent="space-between">
          <WorkspaceLogo
            workspace={workspace}
            sx={{ width: 60, height: 60, borderRadius: "10%" }}
          />

          <ListItemText
            sx={{ mb: 1 }}
            primary={
              <Link
                component={RouterLink}
                href={paths.workspace.detail(id as string)}
                color="inherit"
              >
                {name}
              </Link>
            }
          />
        </Stack>
      </Stack>
      <Divider />
      <Stack direction="row" spacing={2} justifyContent="space-between" sx={{ p: 2 }}>
        <Button
          component={RouterLink}
          href={paths.workspace.detail(id as string)}
          variant="outlined"
          size="small"
          color="error"
        >
          Reject
        </Button>
        <LoadingButton
          loading={openWorkspaceLoading}
          variant="contained"
          size="small"
          onClick={handleOpenWorkspace}
          startIcon={<WorkspaceIcon />}
        >
          Join
        </LoadingButton>
      </Stack>
    </Card>
  );
}
