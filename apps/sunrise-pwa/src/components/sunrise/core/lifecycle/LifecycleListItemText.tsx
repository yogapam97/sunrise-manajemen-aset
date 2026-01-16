import type { ILifecycleItem } from "src/types/lifecycle";

import { Chip } from "@mui/material";

import Iconify from "src/components/iconify/iconify";

import { EMPTY_ICON } from "../icon-definitions";

type LifecycleListItemTextProps = {
  lifecycle: ILifecycleItem;
};
export default function LifecycleListItemText({ lifecycle }: LifecycleListItemTextProps) {
  if (!lifecycle) return <Iconify icon={EMPTY_ICON} />;
  return <Chip size="small" label={lifecycle.name} sx={{ backgroundColor: lifecycle.color }} />;
}
