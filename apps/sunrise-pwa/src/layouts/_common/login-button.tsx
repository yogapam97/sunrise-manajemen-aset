// @mui
import type { Theme, SxProps } from "@mui/material/styles";

import Button from "@mui/material/Button";

// routes
import { RouterLink } from "src/routes/components";

// config
import { PATH_AFTER_LOGIN } from "src/config-global";

import { useAuthContext } from "src/auth/hooks";

// ----------------------------------------------------------------------

type Props = {
  sx?: SxProps<Theme>;
};

export default function LoginButton({ sx }: Props) {
  const { authenticated } = useAuthContext();

  return (
    <Button component={RouterLink} href={PATH_AFTER_LOGIN} variant="outlined" sx={{ mr: 1, ...sx }}>
      {authenticated ? "Workspace" : "Login"}
    </Button>
  );
}
