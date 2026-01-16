import { size, truncate } from "lodash";

import { Box, Tooltip, Typography } from "@mui/material";

import Iconify from "src/components/iconify";

import { EMPTY_ICON } from "../icon-definitions";

type FixedAssetDescriptionColumnProps = {
  description: string;
};

export default function FixedAssetDescriptionColumn({
  description,
}: FixedAssetDescriptionColumnProps) {
  return (
    <Box sx={{ minWidth: size(description) > 150 ? 300 : 50, maxWidth: 300 }}>
      {description ? (
        <Tooltip title={size(description) > 150 && description}>
          <Typography variant="caption">{truncate(description, { length: 150 })}</Typography>
        </Tooltip>
      ) : (
        <Iconify icon={EMPTY_ICON} />
      )}
    </Box>
  );
}
