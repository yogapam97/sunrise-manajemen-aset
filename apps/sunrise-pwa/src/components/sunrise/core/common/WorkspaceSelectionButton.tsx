import { Button } from "@mui/material";

import { paths } from "src/routes/paths";
import { RouterLink } from "src/routes/components";

import Iconify from "src/components/iconify";

import { useWorkspaceContext } from "src/auth/hooks";

import { WORKSPACE_ICON } from "../icon-definitions";

export default function WorkspaceSelectionButton() {
  const { workspace } = useWorkspaceContext();
  return (
    <Button
      LinkComponent={RouterLink}
      variant="outlined"
      startIcon={<Iconify icon={WORKSPACE_ICON} />}
      href={paths.workspace.detail(workspace?.id as string)}
    >
      {workspace?.name}
    </Button>
  );
}
