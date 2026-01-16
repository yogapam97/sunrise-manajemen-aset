// @mui
import type { DialogProps } from "@mui/material/Dialog";

import { useCallback } from "react";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
//

// ----------------------------------------------------------------------

export type ConfirmDialogProps = Omit<DialogProps, "title" | "content"> & {
  title: React.ReactNode;
  content?: React.ReactNode;
  action: React.ReactNode;
  onClose: VoidFunction;
  disableCancelButton?: boolean;
};

export default function ConfirmDialog({
  title,
  content,
  action,
  open,
  onClose,
  disableCancelButton = false,
  ...other
}: ConfirmDialogProps) {
  const handleCloseClick = useCallback(
    (_event: any, reason: string) => {
      if (reason !== "backdropClick") {
        onClose();
      }
    },
    [onClose]
  );
  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={handleCloseClick} {...other}>
      <DialogTitle sx={{ pb: 2 }}>{title}</DialogTitle>

      {content && <DialogContent sx={{ typography: "body2" }}> {content} </DialogContent>}

      <DialogActions>
        {action}

        <Button variant="outlined" color="inherit" disabled={disableCancelButton} onClick={onClose}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
