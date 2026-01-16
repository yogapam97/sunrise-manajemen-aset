import type { IFixedAssetItem } from "src/types/fixed-asset";

import moment from "moment";
import { isEmpty } from "lodash";

import {
  Box,
  Card,
  Chip,
  Stack,
  Badge,
  Alert,
  Button,
  Divider,
  Typography,
  IconButton,
} from "@mui/material";

import { paths } from "src/routes/paths";
import { RouterLink } from "src/routes/components";

import Iconify from "src/components/iconify";

import { useGetCurrentCheckAction } from "../../hook/useFixedAssets";
import MemberListItemLinkButton from "../member/MemberListItemLinkButton";
import FixedAssetCheckStatus from "../fixed-asset/FixedAssetCheckStatusColumn";
import LocationListItemLinkButton from "../location/LocationListItemLinkButton";
import FixedAssetListItemLinkButton from "../fixed-asset/FixedAssetListItemLinkButton";
import {
  ASSIGNMENT_ICON,
  RELOCATION_ICON,
  TRANSITION_ICON,
  EXTERNAL_LINK_ICON,
} from "../icon-definitions";

type CheckFormDetailProps = {
  workspaceId: string;
  fixedAsset: IFixedAssetItem | null;
  hideDetail?: boolean;
};
export default function CheckFormDetail({
  workspaceId,
  fixedAsset,
  hideDetail,
}: CheckFormDetailProps) {
  const getCurrentCheckAction = useGetCurrentCheckAction();
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

  const { current_check } = fixedAsset;
  return (
    <Card sx={{ p: 2 }}>
      <Stack spacing={2}>
        {fixedAsset?.lifecycle?.is_maintenance_cycle && (
          <Alert variant="outlined" severity="warning">
            <Stack spacing={1}>
              <Typography variant="caption">
                This fixed asset is currently under maintenance, you can change current lifecycle by
                doing transition
              </Typography>
              <Box>
                <Button
                  size="small"
                  variant="outlined"
                  component={RouterLink}
                  href={paths.app.transition.create(workspaceId, fixedAsset.id as string)}
                  startIcon={<Iconify icon={TRANSITION_ICON} />}
                  endIcon={<Iconify icon={EXTERNAL_LINK_ICON} />}
                >
                  Transition
                </Button>
              </Box>
            </Stack>
          </Alert>
        )}
        <Stack spacing={2} direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="subtitle2">Current Status</Typography>
          <FixedAssetCheckStatus current_check={current_check} />
        </Stack>
        {fixedAsset?.current_check?.check_in_date && (
          <Stack spacing={2} direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="subtitle2">{`${getCurrentCheckAction(current_check, true).text} Date`}</Typography>

            <Typography variant="body2">
              {moment(fixedAsset?.current_check?.check_in_date).format("LL")}
            </Typography>
          </Stack>
        )}
        {fixedAsset?.current_check?.check_out_date && (
          <Stack spacing={2} direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="subtitle2">{`${getCurrentCheckAction(current_check, true).text} Date`}</Typography>

            <Typography variant="body2">
              {moment(fixedAsset?.current_check?.check_out_date).format("LL")}
            </Typography>
          </Stack>
        )}
        {getCurrentCheckAction(current_check, true).status === "check-out" && (
          <Stack spacing={2} direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="subtitle2">Due Date</Typography>
            <Stack sx={{ textAlign: "right" }}>
              {fixedAsset?.current_check?.check_due_date ? (
                <>
                  <Typography variant="body2">
                    {moment(fixedAsset?.current_check?.check_due_date).format("LL")}
                  </Typography>
                  <Typography variant="caption">
                    {moment(fixedAsset?.current_check?.check_due_date).fromNow()}
                  </Typography>
                </>
              ) : (
                "-"
              )}
            </Stack>
          </Stack>
        )}

        <Typography variant="caption">{`${getCurrentCheckAction(current_check, true).text} to Assignee`}</Typography>

        <Badge
          anchorOrigin={{ vertical: "top", horizontal: "left" }}
          badgeContent={
            fixedAsset?.current_check?.is_assignment && (
              <IconButton
                size="small"
                LinkComponent={RouterLink}
                href={paths.app.assignment.root(workspaceId)}
              >
                <Iconify icon={ASSIGNMENT_ICON} />
              </IconButton>
            )
          }
        >
          <MemberListItemLinkButton member={fixedAsset?.current_check?.assignee} />
        </Badge>
        <Typography variant="caption">{`${getCurrentCheckAction(current_check, true).text} to Location`}</Typography>
        <Badge
          anchorOrigin={{ vertical: "top", horizontal: "left" }}
          badgeContent={
            fixedAsset?.current_check?.is_relocation && (
              <IconButton
                size="small"
                LinkComponent={RouterLink}
                href={paths.app.assignment.root(workspaceId)}
              >
                <Iconify icon={RELOCATION_ICON} />
              </IconButton>
            )
          }
        >
          <LocationListItemLinkButton location={fixedAsset?.current_check?.location} />
        </Badge>
        <Typography variant="caption">Note</Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {fixedAsset?.current_check?.note || "-"}
        </Typography>

        <Typography variant="caption">Checked By</Typography>
        <MemberListItemLinkButton member={fixedAsset?.current_check?.checked_by} />
        {!hideDetail && (
          <>
            <Divider>
              <Chip size="small" variant="outlined" label="Fixed Asset Detail" />
            </Divider>
            <FixedAssetListItemLinkButton fixedAsset={fixedAsset} />
            <Typography variant="caption">Default Assignee</Typography>
            <MemberListItemLinkButton member={fixedAsset?.assignee} />
            <Typography variant="caption">Default Location</Typography>
            <LocationListItemLinkButton location={fixedAsset?.location} />
          </>
        )}
      </Stack>
    </Card>
  );
}
