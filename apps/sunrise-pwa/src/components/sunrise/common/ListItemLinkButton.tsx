import type { AvatarProps } from "@mui/material";

import _ from "lodash";

import {
  Avatar,
  Tooltip,
  Typography,
  ListItemText,
  ListItemIcon,
  ListItemAvatar,
  ListItemButton,
} from "@mui/material";

import { RouterLink } from "src/routes/components";

import Iconify from "src/components/iconify";

type ListItemLinkButtonProps = {
  primary: string | JSX.Element;
  primaryText?: string;
  secondary?: string;
  avatar?: any;
  avatarVariant?: AvatarProps["variant"];
  href: string;
  sx?: any;
  avatarSx?: any;
  textMaxSize?: number;
  icon?: any;
  iconSx?: any;
};

export default function ListItemLinkButton({
  primary,
  primaryText,
  secondary,
  avatar,
  avatarSx,
  href,
  textMaxSize = 20,
  sx,
  avatarVariant = "rounded",
  icon,
  iconSx,
}: ListItemLinkButtonProps) {
  const tooltipTitle = (typeof primary === "string" ? primary : primaryText) || "";
  return (
    <Tooltip
      title={_.size(tooltipTitle) > textMaxSize ? tooltipTitle : ""}
      placement="bottom-start"
    >
      <ListItemButton
        LinkComponent={RouterLink}
        href={href}
        sx={{
          width: 250,
          p: 0,
          pb: 0.5,
          "&:hover": { borderBottom: 1, backgroundColor: "inherit" },
        }}
      >
        {icon && (
          <ListItemIcon>
            <Iconify icon={icon} sx={iconSx} />
          </ListItemIcon>
        )}
        {avatar && (
          <ListItemAvatar>
            <Avatar src={avatar} variant={avatarVariant} sx={avatarSx} />
          </ListItemAvatar>
        )}
        <ListItemText
          disableTypography
          primary={
            typeof primary === "string" ? (
              <Typography
                variant="subtitle2"
                noWrap
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {primary}
              </Typography>
            ) : (
              primary
            )
          }
          secondary={
            secondary && (
              <Typography
                noWrap
                variant="body2"
                color="text.disabled"
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {secondary}
              </Typography>
            )
          }
        />
      </ListItemButton>
    </Tooltip>
  );
}
