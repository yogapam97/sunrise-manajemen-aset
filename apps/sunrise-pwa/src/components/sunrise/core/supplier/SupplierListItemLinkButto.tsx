import type { ISupplierItem } from "src/types/supplier";

import { paths } from "src/routes/paths";

import Iconify from "src/components/iconify";

import { EMPTY_ICON, SUPPLIER_ICON } from "../icon-definitions";
import ListItemLinkButton from "../../common/ListItemLinkButton";

type SupplierListItemLinkButtonProps = {
  supplier: ISupplierItem;
};

export default function SupplierListItemLinkButton({ supplier }: SupplierListItemLinkButtonProps) {
  if (!supplier) return <Iconify icon={EMPTY_ICON} />;

  const { id, name, code, workspace } = supplier;
  return (
    <ListItemLinkButton
      primary={name}
      secondary={code}
      href={paths.app.supplier.detail(workspace, id)}
      icon={SUPPLIER_ICON}
    />
  );
}
