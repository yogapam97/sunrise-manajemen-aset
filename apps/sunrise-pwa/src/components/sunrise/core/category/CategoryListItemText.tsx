import type { ICategoryItem } from "src/types/category";

import { Link, ListItem, ListItemIcon, ListItemText } from "@mui/material";

import { paths } from "src/routes/paths";

import Iconify from "src/components/iconify";

import { EMPTY_ICON } from "../icon-definitions";

type CategoryListItemTextProps = {
  category: ICategoryItem;
};

export default function CategoryListItemText({ category }: CategoryListItemTextProps) {
  if (!category) return <Iconify icon={EMPTY_ICON} />;
  return (
    <ListItem disablePadding>
      <ListItemIcon>
        <Iconify icon={category.icon || EMPTY_ICON} />
      </ListItemIcon>
      <ListItemText
        primary={
          <Link
            noWrap
            color="inherit"
            variant="subtitle2"
            href={paths.app.category.detail(category.workspace, category.id)}
            sx={{ cursor: "pointer" }}
          >
            {category?.name}
          </Link>
        }
        secondary={category.code}
      />
    </ListItem>
  );
}
