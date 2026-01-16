import type { IFixedAssetItem } from "src/types/fixed-asset";

import { isEmpty } from "lodash";

import { Box, Card, Alert, Stack, Button, Typography } from "@mui/material";

import { paths } from "src/routes/paths";
import { RouterLink } from "src/routes/components";

import Iconify from "src/components/iconify";

import { CHECK_IN_ICON, EXTERNAL_LINK_ICON } from "../icon-definitions";
import LifecycleListItemLinkButton from "../lifecycle/LifecycleListItemLinkButton";
import FixedAssetListItemLinkButton from "../fixed-asset/FixedAssetListItemLinkButton";

type MaintenanceFormDetailProps = {
  workspaceId: string;
  fixedAsset: IFixedAssetItem | null;
};
export default function MaintenanceFormDetail({
  workspaceId,
  fixedAsset,
}: MaintenanceFormDetailProps) {
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
        {fixedAsset?.current_check?.status === "check-out" && (
          <Alert variant="outlined" severity="warning">
            <Stack spacing={1}>
              <Typography variant="caption">
                This fixed asset is currently checked out, you still can perform maintenance but be
                sure current fixed asset is in the right place
              </Typography>
              <Box>
                <Button
                  size="small"
                  variant="outlined"
                  component={RouterLink}
                  href={paths.app.check.create(workspaceId, fixedAsset.id as string)}
                  startIcon={<Iconify icon={CHECK_IN_ICON} />}
                  endIcon={<Iconify icon={EXTERNAL_LINK_ICON} />}
                >
                  Check In
                </Button>
              </Box>
            </Stack>
          </Alert>
        )}
        <FixedAssetListItemLinkButton fixedAsset={fixedAsset} />
        <Typography variant="caption">Current Lifecycle</Typography>
        <Box>
          <LifecycleListItemLinkButton label lifecycle={fixedAsset?.lifecycle} />
        </Box>
      </Stack>
    </Card>
  );
}
