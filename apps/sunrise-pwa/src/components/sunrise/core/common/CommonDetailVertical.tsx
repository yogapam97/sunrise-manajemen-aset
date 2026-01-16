import type { IconifyProps } from "src/components/iconify";

import { Card, Stack, Typography } from "@mui/material";

import Iconify from "src/components/iconify";
// import InfoCard from '../../common/card/InfoCard';
// import {
//   CATEGORY_ICON,
//   DEPRECIATION_ICON,
//   FIXED_ASSET_BOOK_VALUE_ICON,
//   FIXED_ASSET_ICON,
//   FIXED_ASSET_PURCHASE_PRICE_ICON,
// } from '../icon-definitions';

type CommonDetailVerticalProps = {
  icon: IconifyProps;
  title: string;
};

export default function CommonDetailVertical({ icon, title }: CommonDetailVerticalProps) {
  return (
    <Card sx={{ p: 4 }}>
      <Stack spacing={1}>
        <Iconify icon={icon} />
        <Typography variant="h4">{title}</Typography>
      </Stack>
      {/* <Stack sx={{ mt: 8 }} spacing={4}>
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
      </Stack> */}
    </Card>
  );
}
