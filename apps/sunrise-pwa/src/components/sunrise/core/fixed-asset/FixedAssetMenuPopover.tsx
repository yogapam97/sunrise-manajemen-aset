import type { IFixedAssetItem } from "src/types/fixed-asset";

import { MenuItem, Typography, ListItemText } from "@mui/material";

import { paths } from "src/routes/paths";
import { RouterLink } from "src/routes/components";

import { useBoolean } from "src/hooks/use-boolean";

import Iconify from "src/components/iconify";
import CustomPopover from "src/components/custom-popover/custom-popover";

import FixedAssetDeleteDialog from "./FixedAssetDeleteDialog";
import { useGetCurrentCheckAction } from "../../hook/useFixedAssets";
import { AUDIT_ICON, ASSIGNMENT_ICON, RELOCATION_ICON, TRANSITION_ICON } from "../icon-definitions";

type FixedAssetMenuPopoverProps = {
  fixedAsset: IFixedAssetItem;
  workspaceId: string;
  open: HTMLElement | null;
  onClose: VoidFunction;
  onDeleted: VoidFunction;
  arrow?: "left-top" | "right-top";
};
export default function FixedAssetMenuPopover({
  workspaceId,
  fixedAsset,
  open,
  onClose,
  onDeleted,
  arrow = "left-top",
}: FixedAssetMenuPopoverProps) {
  const { id, current_check } = fixedAsset;
  const currentCheckAction = useGetCurrentCheckAction();
  const deleteDialog = useBoolean();
  return (
    <>
      <CustomPopover open={open} onClose={onClose} arrow={arrow}>
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
          <ListItemText primary="Audit" />
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
            deleteDialog.onTrue();
            onClose();
          }}
          sx={{ color: "error.main" }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          <ListItemText primary="Delete" />
        </MenuItem>
      </CustomPopover>
      <FixedAssetDeleteDialog
        open={deleteDialog.value}
        onClose={deleteDialog.onFalse}
        fixedAsset={fixedAsset}
        onDeleted={onDeleted}
      />
    </>
  );
}
