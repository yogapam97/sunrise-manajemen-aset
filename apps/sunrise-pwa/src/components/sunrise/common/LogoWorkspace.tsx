import type { BoxProps } from "@mui/material/Box";

import { Avatar } from "@mui/material";

// ----------------------------------------------------------------------

type LogoWorkspaceProps = {
  sx?: BoxProps["sx"];
};

export default function LogoWorkspace({ sx }: LogoWorkspaceProps) {
  return (
    <Avatar
      src="/logo/logo_stageholder.png"
      variant="rounded"
      sx={{ width: 56, height: 56, cursor: "pointer", ...sx }}
    />
  );
}
