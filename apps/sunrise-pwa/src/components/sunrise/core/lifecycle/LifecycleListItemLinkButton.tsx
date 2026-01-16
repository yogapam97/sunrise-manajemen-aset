import type { ILifecycleItem } from "src/types/lifecycle";

import { paths } from "src/routes/paths";

import Label from "src/components/label";
import Iconify from "src/components/iconify";

import { EMPTY_ICON } from "../icon-definitions";
import ListItemLinkButton from "../../common/ListItemLinkButton";

type LifecycleListItemLinkButtonProps = {
  lifecycle: ILifecycleItem;
  label?: boolean;
};

export default function LifecycleListItemLinkButton({
  lifecycle,
  label,
}: LifecycleListItemLinkButtonProps) {
  if (!lifecycle) return <Iconify icon={EMPTY_ICON} color="text.disabled" />;

  const { id, name, code, workspace, color } = lifecycle;

  if (label) {
    return (
      <Label startIcon={<Iconify icon="material-symbols:circle" />} sx={{ color }}>
        {lifecycle?.name}
      </Label>
    );
  }

  return (
    <ListItemLinkButton
      primary={name}
      secondary={code}
      href={paths.app.lifecycle.detail(workspace, id as string)}
      icon="material-symbols:circle"
      iconSx={{ color }}
    />
  );
}
