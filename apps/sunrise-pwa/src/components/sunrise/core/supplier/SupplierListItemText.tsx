import type { ISupplierItem } from "src/types/supplier";

import { Link, ListItem, ListItemText } from "@mui/material";

import { paths } from "src/routes/paths";

import Iconify from "src/components/iconify";

import { EMPTY_ICON } from "../icon-definitions";

type SupplierListItemTextProps = {
  supplier: ISupplierItem;
};

export default function SupplierListItemText({ supplier }: SupplierListItemTextProps) {
  if (!supplier) return <Iconify icon={EMPTY_ICON} />;
  return (
    <ListItem disablePadding>
      <ListItemText
        primary={
          <Link
            noWrap
            color="inherit"
            variant="subtitle2"
            href={paths.app.supplier.detail(supplier.workspace, supplier.id)}
            sx={{ cursor: "pointer" }}
          >
            {supplier?.name}
          </Link>
        }
        secondary={supplier.code}
      />
    </ListItem>
  );
}
