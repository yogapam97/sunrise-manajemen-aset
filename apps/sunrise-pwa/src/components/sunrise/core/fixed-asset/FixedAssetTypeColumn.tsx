import { Stack, Typography } from "@mui/material";

import Iconify from "src/components/iconify";

import { FIXED_ASSET_TANGIBLE_ICON, FIXED_ASSET_INTANGIBLE_ICON } from "../icon-definitions";

type FixedAssetTypeColumnProps = {
  type: string | null | undefined;
};
export default function FixedAssetTypeColumn({ type }: FixedAssetTypeColumnProps) {
  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Iconify
        icon={type === "tangible" ? FIXED_ASSET_TANGIBLE_ICON : FIXED_ASSET_INTANGIBLE_ICON}
      />
      <Typography variant="body2">{type === "tangible" ? "Tangible" : "Intangible"}</Typography>
    </Stack>
  );
}
