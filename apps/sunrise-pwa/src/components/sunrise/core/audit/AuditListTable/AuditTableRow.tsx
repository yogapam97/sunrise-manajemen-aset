// @mui
// types
import type { IAuditItem } from "src/types/audit";

import moment from "moment";

import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
// utils
import { Button, ListItem, Typography, ListItemText } from "@mui/material";

// hooks

import { isColumnVisible } from "src/utils/isColumnVisible";

// components

import { paths } from "src/routes/paths";
import { RouterLink } from "src/routes/components";

import Iconify from "src/components/iconify";

import AuditValueView from "../AuditValueView";
import { NUMERICAL_ICON, CATEGORICAL_ICON } from "../../icon-definitions";
import MemberListItemLinkButton from "../../member/MemberListItemLinkButton";
import FixedAssetListItemLinkButton from "../../fixed-asset/FixedAssetListItemLinkButton";
// ----------------------------------------------------------------------

type Props = {
  workspaceId: string;
  row: IAuditItem;
  configColumns: any[];
  config?: any;
};

export default function AuditTableRow({ workspaceId, row, configColumns, config }: Props) {
  const { fixed_asset, metric, value, audited_by, note } = row;

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
        <AuditValueView metric={metric} value={value} />
      </TableCell>
      <TableCell>
        <Button
          LinkComponent={RouterLink}
          href={paths.app.metric.detail(workspaceId, metric?.id as string)}
          variant="outlined"
          startIcon={
            <Iconify icon={metric?.type === "numerical" ? NUMERICAL_ICON : CATEGORICAL_ICON} />
          }
        >
          {metric?.name}
        </Button>
      </TableCell>
      <TableCell>
        <MemberListItemLinkButton member={audited_by} />
      </TableCell>
    </TableRow>
  );
}
