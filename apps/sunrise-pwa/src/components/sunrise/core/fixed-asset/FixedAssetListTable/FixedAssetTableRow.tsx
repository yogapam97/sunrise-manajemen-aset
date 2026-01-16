// @mui
// utils

import type { IFixedAssetItem } from "src/types/fixed-asset";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import IconButton from "@mui/material/IconButton";
// types
import { Badge, Stack, Popover, Checkbox, ListItem, Typography, ListItemText } from "@mui/material";

import { paths } from "src/routes/paths";
import { RouterLink } from "src/routes/components";

// hooks
import { useBoolean } from "src/hooks/use-boolean";

import { isColumnVisible } from "src/utils/isColumnVisible";

// components
import Iconify from "src/components/iconify";
import { ConfirmDialog } from "src/components/custom-dialog";
import DateColumn from "src/components/sunrise/common/DateColumn";
import CustomPopover, { usePopover } from "src/components/custom-popover";
import { useGetCurrentCheckAction } from "src/components/sunrise/hook/useFixedAssets";

import FixedAssetTypeColumn from "../FixedAssetTypeColumn";
import FixedAssetWarrantyView from "../FixedAssetWarrantyView";
import FixedAssetDescriptionColumn from "../FixedAssetDescriptionColumn";
import FixedAssetSerialNumberColumn from "../FixedAssetSerialNumberColumn";
import FixedAssetPurchaseCostColumn from "../FixedAssetPurchaseCostColumn";
import FixedAssetListItemLinkButton from "../FixedAssetListItemLinkButton";
import MemberListItemLinkButton from "../../member/MemberListItemLinkButton";
import SupplierListItemLinkButton from "../../supplier/SupplierListItemLinkButto";
import CategoryListItemLinkButton from "../../category/CategoryListItemLinkButton";
import LocationListItemLinkButton from "../../location/LocationListItemLinkButton";
import LifecycleListItemLinkButton from "../../lifecycle/LifecycleListItemLinkButton";
import {
  AUDIT_ICON,
  ASSIGNMENT_ICON,
  RELOCATION_ICON,
  TRANSITION_ICON,
} from "../../icon-definitions";

// ----------------------------------------------------------------------

type FixedAssetTableRowProps = {
  row: IFixedAssetItem;
  selected: boolean;
  workspaceId: string;
  onDeleteRow: VoidFunction;
  onGenerateQr: VoidFunction;
  onSelectRow: VoidFunction;
  configColumns: any[];
};

export default function FixedAssetTableRow({
  configColumns,
  workspaceId,
  selected,
  row,
  onDeleteRow,
  onGenerateQr,
  onSelectRow,
}: FixedAssetTableRowProps) {
  const {
    id,
    name,
    serial_number,
    type,
    purchase_cost,
    purchase_date,
    description,
    category,
    location,
    assignee,
    lifecycle,
    supplier,
    current_check,
  } = row;

  const currentCheckAction = useGetCurrentCheckAction();

  const confirm = useBoolean();

  const popover = usePopover();
  const locationPopover = usePopover();
  const assigneePopover = usePopover();

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>
        <TableCell align="left">
          <IconButton color={popover.open ? "primary" : "default"} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
        <TableCell>
          <FixedAssetListItemLinkButton fixedAsset={row} />
        </TableCell>
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
                !location ||
                !current_check?.location ||
                current_check?.location?.id === location?.id
              }
              onMouseEnter={locationPopover.onOpen}
              onMouseLeave={locationPopover.onClose}
            >
              <LocationListItemLinkButton location={current_check?.location || location} />
            </Badge>
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
                !assignee ||
                !current_check?.assignee ||
                current_check?.assignee?.id === assignee?.id
              }
              onMouseEnter={assigneePopover.onOpen}
              onMouseLeave={assigneePopover.onClose}
            >
              <MemberListItemLinkButton member={current_check?.assignee || assignee} />
            </Badge>
          </TableCell>
        )}
        {isColumnVisible(configColumns, "serial_number") && (
          <TableCell>
            <FixedAssetSerialNumberColumn serial_number={serial_number as string} />
          </TableCell>
        )}
        {isColumnVisible(configColumns, "type") && (
          <TableCell>
            <FixedAssetTypeColumn type={type} />
          </TableCell>
        )}
        {isColumnVisible(configColumns, "description") && (
          <TableCell>
            <FixedAssetDescriptionColumn description={description as string} />
          </TableCell>
        )}
        {isColumnVisible(configColumns, "purchase_cost") && (
          <TableCell>
            <FixedAssetPurchaseCostColumn purchase_cost={purchase_cost as number} />
          </TableCell>
        )}
        {isColumnVisible(configColumns, "purchase_date") && (
          <TableCell>
            <DateColumn date={purchase_date} format="LL" />
          </TableCell>
        )}
        {isColumnVisible(configColumns, "lifecycle") && (
          <TableCell>
            <LifecycleListItemLinkButton label lifecycle={lifecycle} />
          </TableCell>
        )}
        {isColumnVisible(configColumns, "category") && (
          <TableCell>
            <CategoryListItemLinkButton category={category} />
          </TableCell>
        )}
        {isColumnVisible(configColumns, "supplier") && (
          <TableCell>
            <SupplierListItemLinkButton supplier={supplier} />
          </TableCell>
        )}

        {isColumnVisible(configColumns, "warranty_expire_date") && (
          <TableCell>
            <FixedAssetWarrantyView warranty_expire_date={row?.warranty_expire_date || null} />
          </TableCell>
        )}
      </TableRow>

      <CustomPopover open={popover.open} onClose={popover.onClose} arrow="left-top">
        <MenuItem
          onClick={() => {
            onGenerateQr();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:qr-code-outline" />
          <ListItemText primary="Generate QR Code" />
        </MenuItem>
        <MenuItem
          sx={{ color: `${currentCheckAction(current_check)?.color}.main` }}
          component={RouterLink}
          href={paths.app.check.create(workspaceId, id)}
        >
          <Iconify icon={currentCheckAction(current_check).icon} />
          <ListItemText primary={currentCheckAction(current_check)?.text} />
        </MenuItem>
        <MenuItem component={RouterLink} href={paths.app.audit.create(workspaceId, id as string)}>
          <Iconify icon={AUDIT_ICON} />
          <ListItem disablePadding>
            <ListItemText primary="Audit" />
          </ListItem>
        </MenuItem>
        <MenuItem
          component={RouterLink}
          href={paths.app.assignment.create(workspaceId, id as string)}
        >
          <Iconify icon={ASSIGNMENT_ICON} />
          <ListItemText
            primary="Assignment"
            secondary={
              <Typography color="text.disabled" variant="caption">
                Change default assignee
              </Typography>
            }
          />
        </MenuItem>
        <MenuItem
          component={RouterLink}
          href={paths.app.relocation.create(workspaceId, id as string)}
        >
          <Iconify icon={RELOCATION_ICON} />
          <ListItemText
            primary="Relocation"
            secondary={
              <Typography color="text.disabled" variant="caption">
                Change default location
              </Typography>
            }
          />
        </MenuItem>
        <MenuItem
          component={RouterLink}
          href={paths.app.transition.create(workspaceId, id as string)}
        >
          <Iconify icon={TRANSITION_ICON} />
          <ListItemText
            primary="Transition"
            secondary={
              <Typography color="text.disabled" variant="caption">
                Change Lifecycle
              </Typography>
            }
          />
        </MenuItem>
        <MenuItem
          component={RouterLink}
          href={paths.app.fixedAsset.edit(workspaceId, id as string)}
        >
          <Iconify icon="solar:pen-bold" />
          <ListItemText primary="Edit" />
        </MenuItem>

        <MenuItem
          onClick={() => {
            confirm.onTrue();
            popover.onClose();
          }}
          sx={{ color: "error.main" }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          <ListItemText primary="Delete" />
        </MenuItem>
      </CustomPopover>

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

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content={
          <Box sx={{ color: "text.secondary" }}>
            <Typography variant="subtitle2">{name}</Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Are you sure you want to delete this fixed asset?
            </Typography>
          </Box>
        }
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Delete
          </Button>
        }
      />
    </>
  );
}
