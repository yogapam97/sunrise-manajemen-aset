import Link from "next/link";
import { m } from "framer-motion";

import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
// @mui
import { alpha } from "@mui/material/styles";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { ListItemText, ListItemButton } from "@mui/material";

import { paths } from "src/routes/paths";
// routes
import { useRouter } from "src/routes/hooks";
import { RouterLink } from "src/routes/components";

import Iconify from "src/components/iconify";
// components
import { varHover } from "src/components/animate";
import { useAvatar } from "src/components/sunrise/hook/useAvatar";
import CustomPopover, { usePopover } from "src/components/custom-popover";
import {
  MEMBER_ICON,
  VERIFIED_ICON,
  WORKSPACE_ICON,
} from "src/components/sunrise/core/icon-definitions";

// auth
import { useAuthContext, useWorkspaceContext } from "src/auth/hooks";

// ----------------------------------------------------------------------
type AccountPopoverProps = {
  is_dashboard?: boolean;
};
export default function AccountPopover({ is_dashboard }: AccountPopoverProps) {
  const { workspace, member } = useWorkspaceContext();
  const router = useRouter();
  const createAvatar = useAvatar({});

  const { logout, user } = useAuthContext();

  const popover = usePopover();

  const handleLogout = async () => {
    try {
      await logout();
      popover.onClose();
      router.replace("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <IconButton
        component={m.button}
        whileTap="tap"
        whileHover="hover"
        variants={varHover(1.05)}
        onClick={popover.onOpen}
        sx={{
          width: 40,
          height: 40,
          background: (theme) => alpha(theme.palette.grey[500], 0.08),
          ...(popover.open && {
            background: (theme) =>
              `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
          }),
        }}
      >
        <Avatar
          src={user?.avatar ? user?.avatar : createAvatar(user?.name)}
          alt={user?.name}
          sx={{
            width: 36,
            height: 36,
            border: (theme) => `solid 2px ${theme.palette.background.default}`,
          }}
        />
      </IconButton>

      <CustomPopover open={popover.open} onClose={popover.onClose} sx={{ p: 0 }}>
        <ListItemButton component={Link} href={paths.profile.root} sx={{ p: 2, pb: 1.5 }}>
          <ListItemText
            primary={
              <Stack direction="row" spacing={1}>
                <Typography variant="subtitle2" noWrap>
                  {user?.name}
                </Typography>
                {user?.email_verified && <Iconify icon={VERIFIED_ICON} color="info.main" />}
              </Stack>
            }
            secondary={<Typography variant="caption">{user?.email}</Typography>}
          />
        </ListItemButton>

        <Divider sx={{ borderStyle: "dashed" }} />

        {is_dashboard && (
          <Stack sx={{ p: 1 }}>
            <MenuItem component={RouterLink} href={paths.workspace.root}>
              <Iconify icon={WORKSPACE_ICON} />
              <Typography variant="body2">My Workspace</Typography>
            </MenuItem>
            <MenuItem
              component={RouterLink}
              href={paths.app.member.edit(workspace?.id as string, member?.id as string)}
            >
              <Iconify icon={MEMBER_ICON} />
              <Typography variant="body2">Member Setting</Typography>
            </MenuItem>
          </Stack>
        )}

        <Divider sx={{ borderStyle: "dashed" }} />

        <MenuItem
          onClick={handleLogout}
          sx={{ m: 1, fontWeight: "fontWeightBold", color: "error.main" }}
        >
          Logout
        </MenuItem>
      </CustomPopover>
    </>
  );
}
