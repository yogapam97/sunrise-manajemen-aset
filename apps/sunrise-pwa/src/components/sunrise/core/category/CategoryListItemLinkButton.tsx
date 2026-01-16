import type { ICategoryItem } from "src/types/category";

import { paths } from "src/routes/paths";

import Iconify from "src/components/iconify";

import { EMPTY_ICON, CATEGORY_ICON } from "../icon-definitions";
import ListItemLinkButton from "../../common/ListItemLinkButton";

type CategoryListItemLinkButtonProps = {
  category: ICategoryItem;
};

export default function CategoryListItemLinkButton({ category }: CategoryListItemLinkButtonProps) {
  if (!category) return <Iconify icon={EMPTY_ICON} />;

  const { id, name, code, workspace, icon } = category;
  return (
    <ListItemLinkButton
      primary={name}
      secondary={code}
      href={paths.app.category.detail(workspace, id)}
      icon={icon || CATEGORY_ICON}
    />
  );
}
