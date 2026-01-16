import type { IFixedAssetItem } from "src/types/fixed-asset";

import { isEmpty } from "lodash";

import { Box, Card, Stack, Typography } from "@mui/material";

import LifecycleListItemLinkButton from "../lifecycle/LifecycleListItemLinkButton";
import FixedAssetListItemLinkButton from "../fixed-asset/FixedAssetListItemLinkButton";

type TransitionFormDetailProps = {
  workspaceId: string;
  fixedAsset: IFixedAssetItem | null;
};
export default function TransitionFormDetail({
  workspaceId,
  fixedAsset,
}: TransitionFormDetailProps) {
  if (isEmpty(fixedAsset)) {
    return (
      <Card sx={{ p: 2 }}>
        <Box
          sx={{
            p: 8,
            color: "text.disabled",
            borderStyle: "dashed",
            borderRadius: 1,
          }}
        >
          <Typography variant="subtitle2">Please select a fixed asset to view details</Typography>
        </Box>
      </Card>
    );
  }
  return (
    <Card sx={{ p: 2 }}>
      <Stack spacing={2}>
        <FixedAssetListItemLinkButton fixedAsset={fixedAsset} />
        <Typography variant="caption">Current Lifecycle</Typography>
        <LifecycleListItemLinkButton lifecycle={fixedAsset?.lifecycle} />
      </Stack>
    </Card>
  );
}
