// @mui
// types
import type { IOperationGroupItem } from "src/types/operation-group";

import Link from "next/link";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import IconButton from "@mui/material/IconButton";
// utils
import { Chip, Stack, Typography } from "@mui/material";

import { paths } from "src/routes/paths";
import { RouterLink } from "src/routes/components";

// hooks
import { useBoolean } from "src/hooks/use-boolean";

// components
import Iconify from "src/components/iconify";
import { ConfirmDialog } from "src/components/custom-dialog";
import CustomPopover, { usePopover } from "src/components/custom-popover";

import {
  RUN_ICON,
  AUDIT_ICON,
  ASSIGNMENT_ICON,
  RELOCATION_ICON,
  TRANSITION_ICON,
  OPERATION_GROUP_ICON,
} from "../../icon-definitions";
// ----------------------------------------------------------------------

type Props = {
  workspaceId: string;
  row: IOperationGroupItem;
  onDeleteRow: VoidFunction;
};

export default function OperationGroupTableRow({ workspaceId, row, onDeleteRow }: Props) {
  const { id, name, is_audit, is_assignment, is_relocation, is_transition, description } = row;

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
          <Button
            LinkComponent={Link}
            href={`${paths.app.operationGroup.detail(workspaceId, id)}?tab=operation-log`}
            variant="outlined"
            color="info"
            size="small"
            startIcon={<Iconify icon={OPERATION_GROUP_ICON} />}
          >
            {name}
          </Button>
        </TableCell>
        <TableCell>
          <Button
            variant="contained"
            size="small"
            LinkComponent={Link}
            href={paths.app.operationGroup.do(workspaceId, id)}
            startIcon={<Iconify icon={RUN_ICON} />}
          >
            Do Operation
          </Button>
        </TableCell>
        <TableCell>
          <Stack direction="row" spacing={1}>
            {is_audit && (
              <Chip
                size="small"
                icon={<Iconify sx={{ width: 15, height: 15 }} icon={AUDIT_ICON} />}
                label="Audit"
                variant="outlined"
              />
            )}
            {is_assignment && (
              <Chip
                size="small"
                icon={<Iconify sx={{ width: 15, height: 15 }} icon={ASSIGNMENT_ICON} />}
                label="Assignment"
                variant="outlined"
              />
            )}
            {is_relocation && (
              <Chip
                size="small"
                icon={<Iconify sx={{ width: 15, height: 15 }} icon={RELOCATION_ICON} />}
                label="Relocation"
                variant="outlined"
              />
            )}
            {is_transition && (
              <Chip
                size="small"
                icon={<Iconify sx={{ width: 15, height: 15 }} icon={TRANSITION_ICON} />}
                label="Transition"
                variant="outlined"
              />
            )}
          </Stack>
        </TableCell>
        <TableCell>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {description || "-"}
          </Typography>
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
          href={paths.app.operationGroup.edit(workspaceId, id as string)}
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
              Are you sure you want to delete this Operation Group?
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
