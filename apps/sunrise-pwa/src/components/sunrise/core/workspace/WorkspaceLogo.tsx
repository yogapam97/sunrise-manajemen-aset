import type { CSSProperties } from "react";
import type { IWorkspaceItem } from "src/types/workspace";

import { Avatar } from "@mui/material";

import { useAvatarIcon } from "../../hook/useAvatarIcon";

type WorkspaceLogoProps = {
  workspace: IWorkspaceItem | null;
  sx?: CSSProperties;
};

export default function WorkspaceLogo({ workspace, sx }: WorkspaceLogoProps) {
  const createLogo = useAvatarIcon();

  return (
    <Avatar
      variant="rounded"
      alt={workspace?.logo}
      src={workspace?.logo || createLogo(workspace?.default_icon || "")}
      sx={sx}
    />
  );
}
