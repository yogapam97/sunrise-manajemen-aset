// @mui
// types
import type { IOperationLogItem } from "src/types/operation-log";

import moment from "moment";

import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
// utils
import { Button, ListItem, Typography, ListItemText } from "@mui/material";

// hooks

import Link from "next/link";

import { paths } from "src/routes/paths";

import { isColumnVisible } from "src/utils/isColumnVisible";

// components
import Iconify from "src/components/iconify";

import OperationLogDetail from "../OperationLogDetail";
import OperationGroupView from "../../operation-group/OperationGroupView";
import MemberListItemLinkButton from "../../member/MemberListItemLinkButton";
import OperationGroupKeyView from "../../operation-group/OperationGroupKeyView";
import FixedAssetListItemLinkButton from "../../fixed-asset/FixedAssetListItemLinkButton";
import {
  AUDIT_ICON,
  ASSIGNMENT_ICON,
  RELOCATION_ICON,
  TRANSITION_ICON,
  MAINTENANCE_ICON,
} from "../../icon-definitions";
// ----------------------------------------------------------------------

type Props = {
  workspaceId: string;
  row: IOperationLogItem;
  configColumns: any[];
  config?: any;
};

export default function OperationLogTableRow({ workspaceId, row, configColumns, config }: Props) {
  const { operation_group, operation_type, operation_subject, details, note, operation_key } = row;
  let icon = "mdi:pencil-outline";
  let operation_link = "";
  switch (operation_type) {
    case "AUDIT":
      icon = AUDIT_ICON;
      operation_link = paths.app.audit.root(workspaceId);
      break;
    case "ASSIGNMENT":
      icon = ASSIGNMENT_ICON;
      operation_link = paths.app.assignment.root(workspaceId);
      break;
    case "RELOCATION":
      icon = RELOCATION_ICON;
      operation_link = paths.app.relocation.root(workspaceId);
      break;
    case "TRANSITION":
      icon = TRANSITION_ICON;
      operation_link = paths.app.transition.root(workspaceId);
      break;
    case "MAINTENANCE":
      icon = MAINTENANCE_ICON;
      operation_link = paths.app.maintenance.root(workspaceId);
      break;
    default:
      break;
  }
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
        <OperationGroupKeyView operation_key={operation_key} />
      </TableCell>
      <TableCell>
        <OperationGroupView workspaceId={workspaceId} operation_group={operation_group} />
      </TableCell>
      <TableCell>
        <Button
          LinkComponent={Link}
          href={operation_link}
          variant="outlined"
          size="small"
          startIcon={<Iconify icon={icon} />}
        >
          {operation_type}
        </Button>
      </TableCell>
      {isColumnVisible(configColumns, "fixed_asset") && (
        <TableCell>
          <FixedAssetListItemLinkButton fixedAsset={row.fixed_asset} />
        </TableCell>
      )}
      <TableCell>
        <OperationLogDetail
          hide_old={config?.hide_old}
          details={details}
          operation_type={operation_type}
        />
      </TableCell>
      <TableCell>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {note || "-"}
        </Typography>
      </TableCell>
      <TableCell>
        <MemberListItemLinkButton member={operation_subject} />
      </TableCell>
    </TableRow>
  );
}
