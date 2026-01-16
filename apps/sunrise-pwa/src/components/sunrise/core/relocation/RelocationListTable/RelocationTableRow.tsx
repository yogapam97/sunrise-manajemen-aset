// @mui
// types
import type { IRelocationItem } from "src/types/relocation";

import moment from "moment";

import Box from "@mui/material/Box";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
// utils
import { Chip, Stack, ListItem, Typography, ListItemText } from "@mui/material";

// hooks

// components
import Iconify from "src/components/iconify";

import MemberListItemLinkButton from "../../member/MemberListItemLinkButton";
import LocationListItemLinkButton from "../../location/LocationListItemLinkButton";
import FixedAssetListItemLinkButton from "../../fixed-asset/FixedAssetListItemLinkButton";
// ----------------------------------------------------------------------

type Props = {
  workspaceId: string;
  row: IRelocationItem;
  onDeleteRow: VoidFunction;
};

export default function RelocationTableRow({ workspaceId, row, onDeleteRow }: Props) {
  return (
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
            {row.old_location ? (
              <LocationListItemLinkButton location={row?.old_location} />
            ) : (
              <Chip size="small" disabled label="No Location" />
            )}
          </Box>
          <Iconify icon="mdi:transfer-right" />
          <Box sx={{ width: 300 }}>
            <LocationListItemLinkButton location={row?.new_location} />
          </Box>
        </Stack>
      </TableCell>
      <TableCell>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {row.note || "-"}
        </Typography>
      </TableCell>
      <TableCell>
        <MemberListItemLinkButton member={row.relocated_by} />
      </TableCell>
    </TableRow>
  );
}
