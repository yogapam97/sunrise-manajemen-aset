import { Link, ListItemText } from "@mui/material";

import { RouterLink } from "src/routes/components";

import Iconify from "src/components/iconify";

import { EMPTY_ICON } from "../icon-definitions";

type CommonListItemTextLinkProps = {
  path: string;
  title: string;
};

export default function CommonListItemTextLink({ path, title }: CommonListItemTextLinkProps) {
  if (!title) return <Iconify icon={EMPTY_ICON} />;
  return (
    <ListItemText
      disableTypography
      primary={
        <Link
          noWrap
          color="inherit"
          variant="subtitle2"
          component={RouterLink}
          href={path}
          sx={{ cursor: "pointer" }}
        >
          {title}
        </Link>
      }
    />
  );
}
