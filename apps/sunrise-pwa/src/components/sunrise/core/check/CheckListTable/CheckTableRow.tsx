// @mui
// types
import type { ICheckItem } from "src/types/check";

import moment from "moment";

import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
// utils
import { Badge, ListItem, Typography, IconButton, ListItemText } from "@mui/material";

// hooks

import { isColumnVisible } from "src/utils/isColumnVisible";

// components

import { paths } from "src/routes/paths";
import { RouterLink } from "src/routes/components";

import Iconify from "src/components/iconify";

import CheckStatusView from "../CheckStatusView";
import { ASSIGNMENT_ICON, RELOCATION_ICON } from "../../icon-definitions";
import MemberListItemLinkButton from "../../member/MemberListItemLinkButton";
import LocationListItemLinkButton from "../../location/LocationListItemLinkButton";
import FixedAssetListItemLinkButton from "../../fixed-asset/FixedAssetListItemLinkButton";
// ----------------------------------------------------------------------

type Props = {
  workspaceId: string;
  row: ICheckItem;
  configColumns: any[];
  config?: any;
};

export default function CheckTableRow({ workspaceId, row, configColumns, config }: Props) {
  const { fixed_asset, assignee, is_assignment, location, is_relocation, checked_by, note } = row;
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
        <CheckStatusView status={row.status} />
      </TableCell>
      {isColumnVisible(configColumns, "fixed_asset") && (
        <TableCell>
          <FixedAssetListItemLinkButton fixedAsset={fixed_asset} />
        </TableCell>
      )}
      <TableCell>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {note || "-"}
        </Typography>
      </TableCell>
      <TableCell>
        <Badge
          anchorOrigin={{ vertical: "top", horizontal: "left" }}
          badgeContent={
            is_assignment && (
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
          <MemberListItemLinkButton member={assignee} />
        </Badge>
      </TableCell>
      <TableCell>
        <Badge
          anchorOrigin={{ vertical: "top", horizontal: "left" }}
          badgeContent={
            is_relocation && (
              <IconButton
                size="small"
                LinkComponent={RouterLink}
                href={paths.app.relocation.root(workspaceId)}
              >
                <Iconify icon={RELOCATION_ICON} />
              </IconButton>
            )
          }
        >
          <LocationListItemLinkButton location={location} />
        </Badge>
      </TableCell>
      <TableCell>
        <MemberListItemLinkButton member={checked_by} />
      </TableCell>
    </TableRow>
  );
}
