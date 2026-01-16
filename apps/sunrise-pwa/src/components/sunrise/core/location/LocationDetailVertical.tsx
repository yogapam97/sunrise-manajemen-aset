import type { ILocationItem } from "src/types/location";

import { Card, Stack, Typography } from "@mui/material";

import Iconify from "src/components/iconify";

import LocationIcon from "./LocationIcon";
import InfoCard from "../../common/card/InfoCard";
import {
  FIXED_ASSET_ICON,
  DEPRECIATION_ICON,
  FIXED_ASSET_BOOK_VALUE_ICON,
  FIXED_ASSET_PURCHASE_PRICE_ICON,
} from "../icon-definitions";

type LocationDetailVerticalProps = {
  location: ILocationItem;
};

export default function LocationDetailVertical({ location }: LocationDetailVerticalProps) {
  return (
    <Card sx={{ p: 4 }}>
      <Stack spacing={1}>
        <LocationIcon />
        <Typography variant="h4">{location.name}</Typography>
        <Typography variant="body2">{location.address}</Typography>
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
