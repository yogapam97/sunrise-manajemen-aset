// @mui
// types
import type { IAssignmentItem } from "src/types/assignment";

import moment from "moment";

import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
// utils
import { Chip, Stack, ListItem, Typography, ListItemText } from "@mui/material";

// hooks
import { useBoolean } from "src/hooks/use-boolean";

// components
import Iconify from "src/components/iconify";
import CustomPopover, { usePopover } from "src/components/custom-popover";

import MemberListItemLinkButton from "../../member/MemberListItemLinkButton";
import FixedAssetListItemLinkButton from "../../fixed-asset/FixedAssetListItemLinkButton";
// ----------------------------------------------------------------------

type Props = {
  workspaceId: string;
  row: IAssignmentItem;
};

export default function AssignmentTableRow({ workspaceId, row }: Props) {
  const confirm = useBoolean();

  const popover = usePopover();

  return (
    <>
      <TableRow hover>
        <TableCell>
          <ListItem disablePadding>
            <ListItemText
              primary={
                <Typography variant="subtitle2" noWrap>
                  {moment(row.created_at).format("LLL")}
                </Typography>
              }
              secondary={moment(row.created_at).fromNow()}
            />
          </ListItem>
        </TableCell>
        <TableCell>
          <FixedAssetListItemLinkButton fixedAsset={row.fixed_asset} />
        </TableCell>
        <TableCell>
          <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
            <Box sx={{ width: 300 }}>
              {row.old_assignee ? (
                <MemberListItemLinkButton member={row?.old_assignee} />
              ) : (
                <Chip size="small" disabled label="No Assignment" />
              )}
            </Box>
            <Iconify icon="mdi:transfer-right" />
            <Box sx={{ width: 300 }}>
              <MemberListItemLinkButton member={row?.new_assignee} />
            </Box>
          </Stack>
        </TableCell>
        <TableCell>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {row.note || "-"}
          </Typography>
        </TableCell>
        <TableCell>
          <MemberListItemLinkButton member={row.assigned_by} />
        </TableCell>
      </TableRow>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="left-top"
        sx={{ width: 140 }}
      >
        <MenuItem
          onClick={() => {
            confirm.onTrue();
            popover.onClose();
          }}
          sx={{ color: "error.main" }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem>
      </CustomPopover>
    </>
  );
}
