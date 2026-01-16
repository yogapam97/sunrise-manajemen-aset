import type { IFixedAssetItem } from "src/types/fixed-asset";

import { identicon } from "@dicebear/collection";

import { Box, Card, Stack, Typography, ListItemText, CardActionArea } from "@mui/material";

import { paths } from "src/routes/paths";
import { RouterLink } from "src/routes/components";

import useCreateAvatar from "src/hooks/use-create-avatar";

import Image from "src/components/image";
import Label from "src/components/label";
import Iconify from "src/components/iconify";

import { useWorkspaceContext } from "src/auth/hooks";

import MemberInfoText from "../member/MemberInfoText";
import {
  CATEGORY_ICON,
  LOCATION_ICON,
  FIXED_ASSET_TANGIBLE_ICON,
  FIXED_ASSET_INTANGIBLE_ICON,
  FIXED_ASSET_PURCHASE_PRICE_ICON,
} from "../icon-definitions";

type InfoStackProps = {
  icon?: string;
  label: string;
};
const InfoStack = ({ label, icon }: InfoStackProps) => (
  <Stack
    spacing={0.5}
    flexShrink={0}
    direction="row"
    alignItems="center"
    sx={{ color: "text.disabled", minWidth: 0 }}
  >
    {icon && <Iconify icon={icon} />}
    <Typography variant="caption" noWrap>
      {label}
    </Typography>
  </Stack>
);

type Props = {
  fixedAsset: IFixedAssetItem;
};

export default function FixedAssetItem({ fixedAsset }: Props) {
  const { workspace } = useWorkspaceContext();
  const {
    id,
    name,
    description,
    thumbnail,
    type,
    category,
    location,
    lifecycle,
    purchase_cost,
    created_by,
  } = fixedAsset;
  const baseThumbnail = useCreateAvatar(identicon, {
    backgroundColor: ["#fff"],
  });

  return (
    <Card>
      <CardActionArea
        component={RouterLink}
        href={paths.app.fixedAsset.detail(workspace?.id as string, id as string)}
        sx={{ textDecoration: "none", height: "100%" }}
      >
        <Label
          variant="filled"
          sx={{ position: "absolute", top: 8, right: 8, backgroundColor: lifecycle?.color }}
        >
          {lifecycle?.name}
        </Label>
        <Stack sx={{ p: 2 }} spacing={2}>
          <Image
            src={baseThumbnail(thumbnail as string)}
            sx={{ width: 60, height: 60, borderRadius: "10%" }}
          />
          <Stack>
            <Stack direction="row" spacing={1} justifyContent="space-between">
              <ListItemText sx={{ mb: 1 }} primary={name} />
            </Stack>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {description}
            </Typography>
          </Stack>
          <MemberInfoText member={created_by} />
          <Box rowGap={1.5} display="grid" gridTemplateColumns="repeat(2, 1fr)">
            <InfoStack label={category?.name as string} icon={CATEGORY_ICON} />
            <InfoStack label={location?.name as string} icon={LOCATION_ICON} />
            <InfoStack
              icon={FIXED_ASSET_PURCHASE_PRICE_ICON}
              label={`${workspace?.currency?.symbol} ${purchase_cost?.toLocaleString()}`}
            />
            <InfoStack
              label={type ? "tangible" : "intangible"}
              icon={type ? FIXED_ASSET_TANGIBLE_ICON : FIXED_ASSET_INTANGIBLE_ICON}
            />
          </Box>
        </Stack>
      </CardActionArea>
    </Card>
  );
}
