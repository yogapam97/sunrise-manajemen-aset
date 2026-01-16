// @mui
import type { IFixedAssetItem } from "src/types/fixed-asset";
import type { IDepreciationItem } from "src/types/depreciation";

// utils
import moment from "moment";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
// types
import { Typography } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import IconButton from "@mui/material/IconButton";
import ListItemText from "@mui/material/ListItemText";

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
import CurrencyDisplay from "src/components/sunrise/common/CurrencyDisplay";

import MemberListItemText from "../../member/MemberListItemText";
import CategoryListItemText from "../../category/CategoryListItemText";
import LocationListItemText from "../../location/LocationListItemText";
import SupplierListItemText from "../../supplier/SupplierListItemText";
import FixedAssetTypeColumn from "../../fixed-asset/FixedAssetTypeColumn";
import LifecycleListItemText from "../../lifecycle/LifecycleListItemText";
import FixedAssetDescriptionColumn from "../../fixed-asset/FixedAssetDescriptionColumn";
import FixedAssetSerialNumberColumn from "../../fixed-asset/FixedAssetSerialNumberColumn";
import FixedAssetListItemLinkButton from "../../fixed-asset/FixedAssetListItemLinkButton";

// ----------------------------------------------------------------------

type Props = {
  workspaceId: string;
  row: IDepreciationItem;
  configColumns: any[];
  onDeleteRow: VoidFunction;
};

export default function DepreciationTableRow({
  workspaceId,
  row,
  onDeleteRow,
  configColumns,
}: Props) {
  const {
    id,
    name,
    serial_number,
    type,
    purchase_date,
    description,
    lifecycle,
    category,
    location,
    supplier,
    assignee,
    active_start_date,
    active_end_date,
    depreciation_rate,
    depreciation_purchase_cost,
    purchase_cost,
    current_purchase_cost,
  } = row;

  const confirm = useBoolean();

  const popover = usePopover();

  return (
    <>
      <TableRow hover>
        <TableCell>
          <IconButton color={popover.open ? "primary" : "default"} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
        <TableCell>
          <FixedAssetListItemLinkButton fixedAsset={row as IFixedAssetItem} />
        </TableCell>
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
        {isColumnVisible(configColumns, "lifecycle") && (
          <TableCell>
            <LifecycleListItemText lifecycle={lifecycle} />
          </TableCell>
        )}
        {isColumnVisible(configColumns, "category") && (
          <TableCell>
            <CategoryListItemText category={category} />
          </TableCell>
        )}
        {isColumnVisible(configColumns, "location") && (
          <TableCell>
            <LocationListItemText location={location} />
          </TableCell>
        )}
        {isColumnVisible(configColumns, "supplier") && (
          <TableCell>
            <SupplierListItemText supplier={supplier} />
          </TableCell>
        )}
        {isColumnVisible(configColumns, "assignee") && (
          <TableCell>
            <MemberListItemText disablePadding member={assignee} />
          </TableCell>
        )}
        {isColumnVisible(configColumns, "purchase_date") && (
          <TableCell>
            <DateColumn date={purchase_date} format="LL" />
          </TableCell>
        )}
        {isColumnVisible(configColumns, "active_start_date") && (
          <TableCell>
            <ListItemText
              primary={moment(active_start_date).format("LL")}
              secondary={moment(active_start_date).fromNow()}
            />
          </TableCell>
        )}
        {isColumnVisible(configColumns, "active_end_date") && (
          <TableCell>
            <ListItemText
              primary={moment(active_end_date).format("LL")}
              secondary={moment(active_end_date).fromNow()}
            />
          </TableCell>
        )}
        {isColumnVisible(configColumns, "purchase_cost") && (
          <TableCell>
            <CurrencyDisplay
              value={purchase_cost}
              color={Number(purchase_cost) > 0 ? "inherit" : "text.disabled"}
            />
          </TableCell>
        )}
        {isColumnVisible(configColumns, "depreciation_rate") && (
          <TableCell>
            <CurrencyDisplay
              value={depreciation_rate}
              color={Number(depreciation_rate) > 0 ? "warning.main" : "text.disabled"}
            />
          </TableCell>
        )}
        {isColumnVisible(configColumns, "depreciation_purchase_cost") && (
          <TableCell>
            <CurrencyDisplay
              value={depreciation_purchase_cost}
              color={Number(depreciation_purchase_cost) > 0 ? "error.main" : "text.disabled"}
            />
          </TableCell>
        )}

        <TableCell>
          <CurrencyDisplay
            value={current_purchase_cost}
            color={Number(current_purchase_cost) > 0 ? "success.main" : "text.disabled"}
          />
        </TableCell>
      </TableRow>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="left-top"
        sx={{ width: 140 }}
      >
        <MenuItem
          component={RouterLink}
          href={paths.app.fixedAsset.edit(workspaceId, id as string)}
        >
          <Iconify icon="solar:pen-bold" />
          Edit
        </MenuItem>

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
