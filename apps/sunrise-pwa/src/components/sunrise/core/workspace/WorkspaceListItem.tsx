import type { IWorkspaceItem } from "src/types/workspace";

import { ListItem, ButtonBase, ListItemText, ListItemAvatar } from "@mui/material";

import { paths } from "src/routes/paths";
import { RouterLink } from "src/routes/components";

import Iconify from "src/components/iconify";

import { useWorkspaceContext } from "src/auth/hooks";

import WorkspaceLogo from "./WorkspaceLogo";
import { WORKSPACE_ICON } from "../icon-definitions";

type WorkspaceListItemProps = {
  sx?: any;
};
export default function WorkspaceListItem({ sx }: WorkspaceListItemProps) {
  const { workspace } = useWorkspaceContext();
  return (
    <ButtonBase
      component={RouterLink}
      sx={{ border: 1, borderRadius: 1, p: 1, minWidth: "150px", borderColor: "grey.300", ...sx }}
      href={paths.workspace.detail(workspace?.id as string)}
    >
      <ListItem disablePadding>
        <ListItemAvatar>
          <WorkspaceLogo
            workspace={workspace as IWorkspaceItem}
            sx={{ width: 24, height: 24, borderRadius: 0.5 }}
          />
        </ListItemAvatar>
        <ListItemText primary={workspace?.name} />
      </ListItem>
      <Iconify icon={WORKSPACE_ICON} />
    </ButtonBase>
  );
}
