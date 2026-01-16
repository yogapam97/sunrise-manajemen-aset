// @mui
// types
import type { IMaintenanceItem } from "src/types/maintenance";

import moment from "moment";

import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
// utils
import { ListItem, Typography, ListItemText } from "@mui/material";

// hooks

import { isColumnVisible } from "src/utils/isColumnVisible";

// components

import Iconify from "src/components/iconify";
import CurrencyDisplay from "src/components/sunrise/common/CurrencyDisplay";

import { EMPTY_ICON } from "../../icon-definitions";
import MemberListItemLinkButton from "../../member/MemberListItemLinkButton";
import LifecycleListItemLinkButton from "../../lifecycle/LifecycleListItemLinkButton";
import FixedAssetListItemLinkButton from "../../fixed-asset/FixedAssetListItemLinkButton";
// ----------------------------------------------------------------------

type Props = {
  workspaceId: string;
  row: IMaintenanceItem;
  configColumns: any[];
  config?: any;
};

export default function MaintenanceTableRow({ workspaceId, row, configColumns, config }: Props) {
  const {
    fixed_asset,
    lifecycle,
    maintenance_cost,
    maintenance_date,
    maintenance_next_date,
    maintained_by,
    note,
  } = row;
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

      {isColumnVisible(configColumns, "lifecycle") && (
        <TableCell>
          <LifecycleListItemLinkButton label lifecycle={lifecycle} />
        </TableCell>
      )}
      {isColumnVisible(configColumns, "fixed_asset") && (
        <TableCell>
          <FixedAssetListItemLinkButton fixedAsset={fixed_asset} />
        </TableCell>
      )}

      {isColumnVisible(configColumns, "maintenance_cost") && (
        <TableCell>
          <CurrencyDisplay value={maintenance_cost} />
        </TableCell>
      )}

      {isColumnVisible(configColumns, "maintenance_date") && (
        <TableCell>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {moment(maintenance_date).format("LL")}
          </Typography>
        </TableCell>
      )}
      {isColumnVisible(configColumns, "maintenance_next_date") && (
        <TableCell>
          {maintenance_next_date ? (
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {moment(maintenance_next_date).format("LL")}
            </Typography>
          ) : (
            <Iconify icon={EMPTY_ICON} color="text.disabled" />
          )}
        </TableCell>
      )}
      <TableCell>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {note || "-"}
        </Typography>
      </TableCell>
      <TableCell>
        <MemberListItemLinkButton member={maintained_by} />
      </TableCell>
    </TableRow>
  );
}
