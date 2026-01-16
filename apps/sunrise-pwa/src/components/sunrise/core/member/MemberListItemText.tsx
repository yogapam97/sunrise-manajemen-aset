import type { IMemberItem } from "src/types/member";

import { Link, ListItem, ListItemText, ListItemAvatar } from "@mui/material";

import { paths } from "src/routes/paths";
import { RouterLink } from "src/routes/components";

import Iconify from "src/components/iconify";

import UserAvatar from "../user/UserAvatar";
import { EMPTY_ICON } from "../icon-definitions";

type MemberListItemTextProps = {
  member: IMemberItem;
  avatarSize?: { width: number; height: number };
  disablePadding?: boolean;
};

export default function MemberListItemText({
  member,
  avatarSize,
  disablePadding,
}: MemberListItemTextProps) {
  if (!member) return <Iconify icon={EMPTY_ICON} />;
  return (
    <ListItem disablePadding={disablePadding}>
      <ListItemAvatar>
        <UserAvatar avatarSize={avatarSize} name={member?.user?.name || member.email} />
      </ListItemAvatar>
      <ListItemText
        primary={
          <Link
            component={RouterLink}
            noWrap
            color="inherit"
            variant="subtitle2"
            href={paths.app.member.detail(member.workspace, member.id)}
            sx={{ cursor: "pointer" }}
          >
            {member?.user?.name}
          </Link>
        }
        secondary={member?.email}
      />
    </ListItem>
  );
}
