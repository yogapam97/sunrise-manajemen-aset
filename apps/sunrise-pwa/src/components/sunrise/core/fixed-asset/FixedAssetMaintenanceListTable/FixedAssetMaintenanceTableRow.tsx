// @mui
// utils

import type { IFixedAssetItem } from "src/types/fixed-asset";

// types
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";

// hooks

import { isColumnVisible } from "src/utils/isColumnVisible";

// components

import moment from "moment";

import { Stack, Popover, Typography, ListItemText } from "@mui/material";

import Iconify from "src/components/iconify/iconify";
import { usePopover } from "src/components/custom-popover";
import CurrencyDisplay from "src/components/sunrise/common/CurrencyDisplay";

import { EMPTY_ICON, INFINITY_ICON } from "../../icon-definitions";
import FixedAssetMaintenanceAction from "../FixedAssetMaintenanceAction";
import FixedAssetListItemLinkButton from "../FixedAssetListItemLinkButton";
import MemberListItemLinkButton from "../../member/MemberListItemLinkButton";
import LocationListItemLinkButton from "../../location/LocationListItemLinkButton";
import LifecycleListItemLinkButton from "../../lifecycle/LifecycleListItemLinkButton";

// ----------------------------------------------------------------------

type FixedAssetMaintenanceTableRowProps = {
  row: IFixedAssetItem;
  selected: boolean;
  workspaceId: string;
  configColumns: any[];
};

export default function FixedAssetMaintenanceTableRow({
  configColumns,
  workspaceId,
  selected,
  row,
}: FixedAssetMaintenanceTableRowProps) {
  const { id, location, assignee, current_maintenance, lifecycle } = row;
  const locationPopover = usePopover();
  const assigneePopover = usePopover();

  return (
    <TableRow hover selected={selected}>
      {isColumnVisible(configColumns, "maintenance_next_date") && (
        <TableCell>
          {current_maintenance?.maintenance_next_date ? (
            <ListItemText
              sx={{
                whiteSpace: "nowrap",
                color: moment(current_maintenance?.maintenance_next_date).isBefore(moment(), "day")
                  ? "error.main"
                  : "text.primary",
              }}
              primary={moment(current_maintenance?.maintenance_next_date).format("LL")}
              secondary={`${
                moment(current_maintenance?.maintenance_next_date).isBefore(moment(), "day")
                  ? "Expired "
                  : ""
              }${moment(current_maintenance?.maintenance_next_date).fromNow()}`}
            />
          ) : (
            <Iconify color="text.disabled" icon={INFINITY_ICON} />
          )}
        </TableCell>
      )}
      <TableCell>
        <FixedAssetListItemLinkButton fixedAsset={row} />
      </TableCell>
      <TableCell>
        <LifecycleListItemLinkButton label lifecycle={lifecycle} />
      </TableCell>
      {isColumnVisible(configColumns, "action") && (
        <TableCell>
          <FixedAssetMaintenanceAction workspaceId={workspaceId} fixedAsset={row} />
        </TableCell>
      )}

      {isColumnVisible(configColumns, "maintenance_cost") && (
        <TableCell>
          {current_maintenance?.maintenance_cost ? (
            <CurrencyDisplay value={current_maintenance?.maintenance_cost} />
          ) : (
            <Iconify color="text.disabled" icon={EMPTY_ICON} />
          )}
        </TableCell>
      )}

      {isColumnVisible(configColumns, "maintenance_date") && (
        <TableCell>
          {current_maintenance?.maintenance_date ? (
            <ListItemText
              sx={{
                whiteSpace: "nowrap",
              }}
              primary={moment(current_maintenance?.maintenance_date).format("LL")}
              secondary={moment(current_maintenance?.maintenance_date).fromNow()}
            />
          ) : (
            <Iconify color="text.disabled" icon={EMPTY_ICON} />
          )}
        </TableCell>
      )}

      {isColumnVisible(configColumns, "note") && (
        <TableCell>
          {current_maintenance?.note ? (
            <Typography variant="caption">{current_maintenance?.note}</Typography>
          ) : (
            <Typography variant="caption" color="text.secondary">
              -
            </Typography>
          )}
        </TableCell>
      )}
      {isColumnVisible(configColumns, "maintained_by") && (
        <TableCell>
          <MemberListItemLinkButton member={current_maintenance?.maintained_by} />
        </TableCell>
      )}

      {location &&
        current_maintenance?.location &&
        current_maintenance?.location?.id !== location?.id && (
          <Popover
            open={Boolean(locationPopover.open)}
            anchorEl={locationPopover.open}
            anchorOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            transformOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            sx={{
              pointerEvents: "none",
            }}
          >
            <Stack sx={{ p: 1 }}>
              <Typography sx={{ ml: 4.5 }} variant="caption" color="text.secondary">
                Default Location
              </Typography>
              <LocationListItemLinkButton location={location} />
            </Stack>
          </Popover>
        )}
      {assignee &&
        current_maintenance?.assignee &&
        current_maintenance?.assignee?.id !== assignee?.id && (
          <Popover
            open={Boolean(assigneePopover.open)}
            anchorEl={assigneePopover.open}
            anchorOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            transformOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            sx={{
              pointerEvents: "none",
            }}
          >
            <Stack sx={{ p: 1 }}>
              <Typography sx={{ ml: 7 }} variant="caption" color="text.secondary">
                Default Assignee
              </Typography>
              <MemberListItemLinkButton member={assignee} />
            </Stack>
          </Popover>
        )}
    </TableRow>
  );
}
