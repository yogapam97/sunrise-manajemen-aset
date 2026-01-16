import type { ILocationItem } from "src/types/location";

import { paths } from "src/routes/paths";

import Iconify from "src/components/iconify";

import { EMPTY_ICON, LOCATION_ICON } from "../icon-definitions";
import ListItemLinkButton from "../../common/ListItemLinkButton";

type LocationListItemLinkButtonProps = {
  location: ILocationItem;
};

export default function LocationListItemLinkButton({ location }: LocationListItemLinkButtonProps) {
  if (!location) return <Iconify icon={EMPTY_ICON} />;

  const { id, name, code, workspace } = location;
  return (
    <ListItemLinkButton
      primary={name}
      secondary={code}
      href={paths.app.location.detail(workspace, id)}
      icon={LOCATION_ICON}
    />
  );
}
