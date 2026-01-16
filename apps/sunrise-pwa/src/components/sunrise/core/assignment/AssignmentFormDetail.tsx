import type { IFixedAssetItem } from "src/types/fixed-asset";

import { isEmpty } from "lodash";

import { Box, Card, Stack, Typography } from "@mui/material";

import MemberListItemLinkButton from "../member/MemberListItemLinkButton";
import FixedAssetListItemLinkButton from "../fixed-asset/FixedAssetListItemLinkButton";

type AssignmentFormDetailProps = {
  workspaceId: string;
  fixedAsset: IFixedAssetItem | null;
};
export default function AssignmentFormDetail({
  workspaceId,
  fixedAsset,
}: AssignmentFormDetailProps) {
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
        <Typography variant="caption">Current Default Assignee</Typography>
        <MemberListItemLinkButton member={fixedAsset?.assignee} />
      </Stack>
    </Card>
  );
}
