import type { IMemberItem } from "src/types/member";

import { Stack, Typography } from "@mui/material";

import { paths } from "src/routes/paths";

import Iconify from "src/components/iconify";

import { useAvatar } from "../../hook/useAvatar";
import { EMPTY_ICON, VERIFIED_ICON } from "../icon-definitions";
import ListItemLinkButton from "../../common/ListItemLinkButton";

type MemberListItemLinkButtonProps = {
  member: IMemberItem;
};

export default function MemberListItemLinkButton({ member }: MemberListItemLinkButtonProps) {
  const createAvatar = useAvatar({});
  if (!member) return <Iconify color="text.disabled" icon={EMPTY_ICON} />;

  const { id, email, user, code, workspace } = member;
  const thisAvatar = user?.avatar || createAvatar(user?.name || email);
  const renderUser = (
    <Stack direction="row" spacing={1} alignItems="center">
      {(user?.name && (
        <Typography
          variant="subtitle2"
          noWrap
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {user?.name}
        </Typography>
      )) || (
        <Typography
          variant="subtitle2"
          color="text.disabled"
          noWrap
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {email}
        </Typography>
      )}
      {user?.email_verified && (
        <Iconify icon={VERIFIED_ICON} sx={{ width: 15, height: 15 }} color="info.main" />
      )}
    </Stack>
  );
  return (
    <ListItemLinkButton
      primary={renderUser}
      primaryText={user?.name || email}
      secondary={code}
      href={paths.app.member.detail(workspace, id)}
      avatar={thisAvatar}
      avatarVariant="circular"
    />
  );
}
