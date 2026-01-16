import type { IUserItem } from "src/types/user";

import { Link, Avatar, ListItem, ListItemText, ListItemAvatar } from "@mui/material";

import Iconify from "src/components/iconify";

import { EMPTY_ICON } from "../icon-definitions";

type UserListItemTextProps = {
  user: IUserItem;
};
export default function UserListItemText({ user }: UserListItemTextProps) {
  if (!user) return <Iconify icon={EMPTY_ICON} />;
  return (
    <ListItem sx={{ p: 0 }}>
      <ListItemAvatar>
        <Avatar src={user?.avatar} variant="circular" sx={{ width: 32, height: 32 }} />
      </ListItemAvatar>
      <ListItemText
        primary={
          <Link color="inherit" variant="subtitle2" sx={{ cursor: "pointer" }} noWrap>
            {user?.name}
          </Link>
        }
        secondary={user?.email}
      />
    </ListItem>
  );
}
