import nProgress from "nprogress";

import { Link, ListItem, ListItemIcon, ListItemText } from "@mui/material";

import Iconify from "src/components/iconify";

import { EMPTY_ICON } from "../core/icon-definitions";

type EmailListItemProps = {
  email: string;
};

export default function EmailListItem({ email }: EmailListItemProps) {
  return email ? (
    <ListItem disablePadding>
      <ListItemIcon>
        <Iconify icon="mdi:email-outline" />
      </ListItemIcon>
      <ListItemText
        primary={
          <Link
            href={`mailto:${email}`}
            color="inherit"
            underline="hover"
            sx={{ cursor: "pointer" }}
            onClick={(e) => {
              e.stopPropagation();
              nProgress.done();
            }}
          >
            {email}
          </Link>
        }
      />
    </ListItem>
  ) : (
    <Iconify icon={EMPTY_ICON} />
  );
}
