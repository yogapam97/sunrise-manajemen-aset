// @mui
// types
import type { ILifecycleItem } from "src/types/lifecycle";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
// utils
import { Chip, Typography } from "@mui/material";
import IconButton from "@mui/material/IconButton";

import { paths } from "src/routes/paths";
import { RouterLink } from "src/routes/components";

// hooks
import { useBoolean } from "src/hooks/use-boolean";

// components
import Iconify from "src/components/iconify";
import { ConfirmDialog } from "src/components/custom-dialog";
import CustomPopover, { usePopover } from "src/components/custom-popover";
import ListItemLinkButton from "src/components/sunrise/common/ListItemLinkButton";

// ----------------------------------------------------------------------

type Props = {
  row: ILifecycleItem;
  workspaceId: string;
  onDeleteRow: VoidFunction;
};

export default function LifecycleTableRow({ row, workspaceId, onDeleteRow }: Props) {
  const { id, name, code } = row;

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
            href={paths.app.lifecycle.detail(workspaceId, id as string)}
          />
        </TableCell>
        <TableCell>
          {row.color && (
            <Chip label={row.color} sx={{ color: "common.white", bgcolor: row.color }} />
          )}
        </TableCell>
      </TableRow>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="left-top"
        sx={{ width: 140 }}
      >
        <MenuItem component={RouterLink} href={paths.app.lifecycle.edit(workspaceId, id as string)}>
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
              Are you sure you want to delete this lifecycle?
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
