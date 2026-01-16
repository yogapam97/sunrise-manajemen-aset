import type { ICategoryItem } from "src/types/category";

import { Card, Stack, Typography } from "@mui/material";

import Iconify from "src/components/iconify";

import InfoCard from "../../common/card/InfoCard";
import {
  CATEGORY_ICON,
  FIXED_ASSET_ICON,
  DEPRECIATION_ICON,
  FIXED_ASSET_BOOK_VALUE_ICON,
  FIXED_ASSET_PURCHASE_PRICE_ICON,
} from "../icon-definitions";

type CategoryDetailVerticalProps = {
  category: ICategoryItem;
};

export default function CategoryDetailVertical({ category }: CategoryDetailVerticalProps) {
  return (
    <Card sx={{ p: 4 }}>
      <Stack spacing={1}>
        <Iconify icon={CATEGORY_ICON} />
        <Typography variant="h4">{category.name}</Typography>
        <Typography variant="body2">{category.description}</Typography>
      </Stack>
      <Stack sx={{ mt: 8 }} spacing={4}>
        <InfoCard
          title="Fixed Asset"
          content="200"
          info={<Iconify width={35} height={35} icon={FIXED_ASSET_ICON} />}
        />
        <InfoCard
          title="Total Value"
          content="200.000.000"
          info={<Iconify width={35} height={35} icon={FIXED_ASSET_PURCHASE_PRICE_ICON} />}
        />
        <InfoCard
          title="Total Depreciation"
          content="1.000.000"
          info={<Iconify width={35} height={35} icon={DEPRECIATION_ICON} />}
        />
        <InfoCard
          title="Current Value"
          content="199.000.000"
          info={<Iconify width={35} height={35} icon={FIXED_ASSET_BOOK_VALUE_ICON} />}
        />
      </Stack>
    </Card>
  );
}
