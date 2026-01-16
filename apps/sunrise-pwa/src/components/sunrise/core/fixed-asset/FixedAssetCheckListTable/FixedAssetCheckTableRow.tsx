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

import { Badge, Stack, Popover, Typography, ListItemText } from "@mui/material";

import Iconify from "src/components/iconify/iconify";
import { usePopover } from "src/components/custom-popover";

import CheckStatusView from "../../check/CheckStatusView";
import FixedAssetCheckAction from "../FixedAssetCheckAction";
import { EMPTY_ICON, INFINITY_ICON } from "../../icon-definitions";
import FixedAssetListItemLinkButton from "../FixedAssetListItemLinkButton";
import MemberListItemLinkButton from "../../member/MemberListItemLinkButton";
import LocationListItemLinkButton from "../../location/LocationListItemLinkButton";

// ----------------------------------------------------------------------

type FixedAssetCheckTableRowProps = {
  row: IFixedAssetItem;
  selected: boolean;
  workspaceId: string;
  configColumns: any[];
};

export default function FixedAssetCheckTableRow({
  configColumns,
  workspaceId,
  selected,
  row,
}: FixedAssetCheckTableRowProps) {
  const { id, location, assignee, current_check } = row;
  const locationPopover = usePopover();
  const assigneePopover = usePopover();

  return (
    <TableRow hover selected={selected}>
      {isColumnVisible(configColumns, "check_due_date") && (
        <TableCell>
          {current_check?.check_due_date ? (
            <ListItemText
              sx={{
                whiteSpace: "nowrap",
                color: moment(current_check?.check_due_date).isBefore(moment(), "day")
                  ? "error.main"
                  : "text.primary",
              }}
              primary={moment(current_check?.check_due_date).format("LL")}
              secondary={`${
                moment(current_check?.check_due_date).isBefore(moment(), "day") ? "Expired " : ""
              }${moment(current_check?.check_due_date).fromNow()}`}
            />
          ) : (
            <Iconify color="text.disabled" icon={INFINITY_ICON} />
          )}
        </TableCell>
      )}
      <TableCell>
        <FixedAssetListItemLinkButton fixedAsset={row} />
      </TableCell>
      {isColumnVisible(configColumns, "current_check") && (
        <TableCell>
          <CheckStatusView status={current_check?.status} />
        </TableCell>
      )}
      {isColumnVisible(configColumns, "action") && (
        <TableCell>
          <FixedAssetCheckAction id={id} workspaceId={workspaceId} current_check={current_check} />
        </TableCell>
      )}
      {isColumnVisible(configColumns, "assignee") && (
        <TableCell>
          <Badge
            anchorOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            color="warning"
            variant="dot"
            invisible={
              !assignee || !current_check?.assignee || current_check?.assignee?.id === assignee?.id
            }
            onMouseEnter={assigneePopover.onOpen}
            onMouseLeave={assigneePopover.onClose}
          >
            <MemberListItemLinkButton member={current_check?.assignee || assignee} />
          </Badge>
        </TableCell>
      )}
      {isColumnVisible(configColumns, "location") && (
        <TableCell>
          <Badge
            anchorOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            color="warning"
            variant="dot"
            invisible={
              !location || !current_check?.location || current_check?.location?.id === location?.id
            }
            onMouseEnter={locationPopover.onOpen}
            onMouseLeave={locationPopover.onClose}
          >
            <LocationListItemLinkButton location={current_check?.location || location} />
          </Badge>
        </TableCell>
      )}
      {isColumnVisible(configColumns, "in_out_date") && (
        <TableCell>
          {current_check?.check_in_date || current_check?.check_out_date ? (
            <ListItemText
              sx={{ whiteSpace: "nowrap" }}
              primary={moment(current_check?.check_in_date || current_check?.check_out_date).format(
                "LL"
              )}
              secondary={moment(
                current_check?.check_in_date || current_check?.check_out_date
              ).fromNow()}
            />
          ) : (
            <Iconify icon={EMPTY_ICON} />
          )}
        </TableCell>
      )}
      {isColumnVisible(configColumns, "note") && (
        <TableCell>{current_check?.note || "-"}</TableCell>
      )}
      {isColumnVisible(configColumns, "checked_by") && (
        <TableCell>
          <MemberListItemLinkButton member={current_check?.checked_by} />
        </TableCell>
      )}

      {location && current_check?.location && current_check?.location?.id !== location?.id && (
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
      {assignee && current_check?.assignee && current_check?.assignee?.id !== assignee?.id && (
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
