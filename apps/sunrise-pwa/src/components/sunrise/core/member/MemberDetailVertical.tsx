import { initials } from "@dicebear/collection";

import { Card, Stack, Avatar, Typography } from "@mui/material";

import useCreateAvatar from "src/hooks/use-create-avatar";

import Iconify from "src/components/iconify";

import InfoCard from "../../common/card/InfoCard";
import {
  FIXED_ASSET_ICON,
  DEPRECIATION_ICON,
  FIXED_ASSET_BOOK_VALUE_ICON,
  FIXED_ASSET_PURCHASE_PRICE_ICON,
} from "../icon-definitions";

type MemberDetailVerticalProps = {
  member: any;
};
export default function MemberDetailVertical({ member }: MemberDetailVerticalProps) {
  const createAvatar = useCreateAvatar(initials, { backgroundColor: ["000"] });
  return (
    <Card sx={{ p: 4 }}>
      <Stack spacing={1}>
        <Avatar
          src={member?.user?.avatar ? member?.user?.avatar : createAvatar(member?.user?.name)}
          alt={member?.user?.name}
          sx={{
            width: 128,
            height: 128,
            border: (theme) => `solid 2px ${theme.palette.background.default}`,
          }}
        />
        <Typography variant="h4">{member?.user?.name}</Typography>
        <Typography variant="body2">{member?.user?.email}</Typography>
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
