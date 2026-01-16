// @mui
// types
import type { IMemberItem } from "src/types/member";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
// utils
import { Typography } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import IconButton from "@mui/material/IconButton";

import { paths } from "src/routes/paths";
import { RouterLink } from "src/routes/components";

// hooks
import { useBoolean } from "src/hooks/use-boolean";

// components
import Iconify from "src/components/iconify";
import { ConfirmDialog } from "src/components/custom-dialog";
import CustomPopover, { usePopover } from "src/components/custom-popover";
import EmailListItem from "src/components/sunrise/common/EmailListItem";

import MemberListItemLinkButton from "../MemberListItemLinkButton";
import MemberInvitationStatusChip from "../MemberInvitationStatusChip";

// ----------------------------------------------------------------------

type Props = {
  row: IMemberItem;
  workspaceId: string;
  onDeleteRow: VoidFunction;
  onResetPassword: (id: string) => void;
  onResendInvitation: (id: string) => void;
};

export default function MemberTableRow({
  workspaceId,
  row,
  onDeleteRow,
  onResetPassword,
  onResendInvitation,
}: Props) {
  const { id, email, role, invitation_status } = row;

  const confirm = useBoolean();

  const popover = usePopover();

  return (
    <>
      <TableRow hover>
        <TableCell align="left">
          <IconButton
            disabled={invitation_status === "mastered"}
            color={popover.open ? "primary" : "default"}
            onClick={popover.onOpen}
          >
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
        <TableCell>
          <MemberListItemLinkButton member={row} />
        </TableCell>
        <TableCell>
          <EmailListItem email={email} />
        </TableCell>
        <TableCell>{role}</TableCell>
        <TableCell>
          <MemberInvitationStatusChip status={invitation_status} />
        </TableCell>
      </TableRow>

      <CustomPopover open={popover.open} onClose={popover.onClose} arrow="left-top">
        <MenuItem
          component={RouterLink}
          disabled={invitation_status === "mastered"}
          href={paths.app.member.edit(workspaceId, id as string)}
        >
          <Iconify icon="solar:pen-bold" />
          Edit
        </MenuItem>
        {invitation_status === "pending" && (
          <MenuItem
            onClick={() => {
              onResendInvitation(id);
              popover.onClose();
            }}
          >
            <Iconify icon="solar:user-plus-broken" />
            Resend Invitation
          </MenuItem>
        )}
        {invitation_status === "accepted" && (
          <MenuItem
            onClick={() => {
              onResetPassword(id);
              popover.onClose();
            }}
          >
            <Iconify icon="fluent:password-reset-48-regular" />
            Send Reset Password Email
          </MenuItem>
        )}
        {invitation_status !== "mastered" && (
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
        )}
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content={
          <Box sx={{ color: "text.secondary" }}>
            <Typography variant="subtitle2">{email}</Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Are you sure you want to delete this member?
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
