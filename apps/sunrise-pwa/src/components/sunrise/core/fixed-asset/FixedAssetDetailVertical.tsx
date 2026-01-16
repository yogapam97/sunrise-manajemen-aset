import type { IFixedAssetItem } from "src/types/fixed-asset";

import moment from "moment";

import { Box, Card, Stack, alpha, Typography } from "@mui/material";

import FixedAssetDetailImages from "./FixedAssetDetailImages";
import FixedAssetDetailThumbnail from "./FixedAssetDetailThumbnail";

type FixedAssetDetailVerticalProps = {
  fixedAsset: IFixedAssetItem;
  onChangeTab?: (newTab: any) => void;
};

export default function FixedAssetDetailVertical({
  fixedAsset,
  onChangeTab,
}: FixedAssetDetailVerticalProps) {
  const { name, thumbnail, description, images, created_at } = fixedAsset;

  const handleClickMoreImages = () => {
    if (onChangeTab) {
      onChangeTab("images");
    }
  };

  return (
    <Card sx={{ p: 4 }}>
      <Stack spacing={1}>
        <FixedAssetDetailThumbnail name={name as string} thumbnail={thumbnail || null} />
        {/* <Image
          src={thumbnail || createThumbnail(fixedAsset.name as string)}
          alt={fixedAsset.name}
          sx={{ width: '100%', height: '256', borderRadius: 1 }}
        /> */}
        <Typography variant="h4">{name}</Typography>
        <Typography variant="body2">{description}</Typography>
        <Stack>
          <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
            Images
          </Typography>
          {images.length > 0 ? (
            <FixedAssetDetailImages
              withViewMore
              onClickMoreImages={handleClickMoreImages}
              images={images.slice(0, 4)}
            />
          ) : (
            <Box
              sx={{
                outline: "none",
                borderRadius: 1,
                p: 1,
                color: "text.secondary",
                textAlign: "center",
                bgcolor: (theme) => alpha(theme.palette.grey[500], 0.08),
              }}
            >
              <Typography variant="caption">No more images available</Typography>
            </Box>
          )}
        </Stack>
        <Stack>
          <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
            Date Created
          </Typography>
          <Typography variant="body2">{moment(created_at).format("LLL")}</Typography>
          <Typography variant="caption">{moment(created_at).fromNow()}</Typography>
        </Stack>
      </Stack>
    </Card>
  );
}
