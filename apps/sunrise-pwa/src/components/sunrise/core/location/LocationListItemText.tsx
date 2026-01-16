import type { ILocationItem } from "src/types/location";

import { Link, ListItem, ListItemIcon, ListItemText } from "@mui/material";

import { paths } from "src/routes/paths";

import Iconify from "src/components/iconify";

import { EMPTY_ICON, LOCATION_ICON } from "../icon-definitions";

type LocationListItemTextProps = {
  location: ILocationItem;
};

export default function LocationListItemText({ location }: LocationListItemTextProps) {
  if (!location) return <Iconify icon={EMPTY_ICON} />;
  return (
    <ListItem disablePadding>
      <ListItemIcon>
        <Iconify icon={LOCATION_ICON} />
      </ListItemIcon>
      <ListItemText
        primary={
          <Link
            noWrap
            color="inherit"
            variant="subtitle2"
            href={paths.app.location.detail(location.workspace, location.id)}
            sx={{ cursor: "pointer" }}
          >
            {location?.name}
          </Link>
        }
        secondary={location.code}
      />
    </ListItem>
  );
}
