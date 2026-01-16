import type { IFixedAssetItem } from "src/types/fixed-asset";

import { isEmpty } from "lodash";

import { Box, Card, Stack, Typography } from "@mui/material";

import FixedAssetListItemLinkButton from "../fixed-asset/FixedAssetListItemLinkButton";

type AuditFormDetailProps = {
  workspaceId: string;
  fixedAsset: IFixedAssetItem | null;
};
export default function AuditFormDetail({ workspaceId, fixedAsset }: AuditFormDetailProps) {
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
      </Stack>
    </Card>
  );
}
