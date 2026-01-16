// @mui
// types
import type { ISupplierItem } from "src/types/supplier";

import nProgress from "nprogress";

import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import IconButton from "@mui/material/IconButton";
import ListItemText from "@mui/material/ListItemText";
// utils
import { ListItem, Typography, ListItemIcon } from "@mui/material";

import { paths } from "src/routes/paths";
import { RouterLink } from "src/routes/components";

// hooks
import { useBoolean } from "src/hooks/use-boolean";

// components
import Iconify from "src/components/iconify";
import { ConfirmDialog } from "src/components/custom-dialog";
import CustomPopover, { usePopover } from "src/components/custom-popover";
import ListItemLinkButton from "src/components/sunrise/common/ListItemLinkButton";

import { EMPTY_ICON } from "../../icon-definitions";
// ----------------------------------------------------------------------

type Props = {
  workspaceId: string;
  row: ISupplierItem;
  onDeleteRow: VoidFunction;
};

export default function SupplierTableRow({ workspaceId, row, onDeleteRow }: Props) {
  const { id, name, code } = row;
  console.log(code);

  const confirm = useBoolean();

  const popover = usePopover();

  return (
    <>
      <TableRow hover>
        <TableCell align="left">
          <IconButton color={popover.open ? "primary" : "default"} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
        <TableCell>
          <ListItemLinkButton
            primary={name}
            secondary={code}
            href={paths.app.supplier.detail(workspaceId, id as string)}
          />
        </TableCell>
        <TableCell>
          {row.url ? (
            <ListItem disablePadding>
              <ListItemIcon>
                <Iconify icon="mdi:open-in-new" />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Link
                    href={row.url}
                    color="inherit"
                    underline="hover"
                    target="_blank"
                    sx={{ cursor: "pointer" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      nProgress.done();
                    }}
                  >
                    {row.url}
                  </Link>
                }
              />
            </ListItem>
          ) : (
            <Iconify icon={EMPTY_ICON} />
          )}
        </TableCell>
        <TableCell>
          {row.email ? (
            <ListItem disablePadding>
              <ListItemIcon>
                <Iconify icon="mdi:email-outline" />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Link
                    href={`mailto:${row.email}`}
                    color="inherit"
                    underline="hover"
                    sx={{ cursor: "pointer" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      nProgress.done();
                    }}
                  >
                    {row.email}
                  </Link>
                }
              />
            </ListItem>
          ) : (
            <Iconify icon={EMPTY_ICON} />
          )}
        </TableCell>
        <TableCell>
          {row.phone ? (
            <ListItem disablePadding>
              <ListItemIcon>
                <Iconify icon="mdi:phone-outline" />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Link
                    href={`tel:${row.phone}`}
                    color="inherit"
                    underline="hover"
                    sx={{ cursor: "pointer" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      nProgress.done();
                    }}
                  >
                    {row.phone}
                  </Link>
                }
              />
            </ListItem>
          ) : (
            <Iconify icon={EMPTY_ICON} />
          )}
        </TableCell>
      </TableRow>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="left-top"
        sx={{ width: 140 }}
      >
        <MenuItem component={RouterLink} href={paths.app.supplier.edit(workspaceId, id as string)}>
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
              Are you sure you want to delete this supplier?
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
