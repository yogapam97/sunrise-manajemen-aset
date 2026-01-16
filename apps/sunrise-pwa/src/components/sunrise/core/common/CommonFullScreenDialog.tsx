import type { ReactNode } from "react";

import { Card, Button, Dialog, DialogContent } from "@mui/material";

import Iconify from "src/components/iconify";

type CommonFullScreenDialogProps = {
  children: ReactNode;
  open: any;
  onClose: VoidFunction;
};
export default function CommonFullScreenDialog({
  children,
  open,
  onClose,
}: CommonFullScreenDialogProps) {
  return (
    <Dialog fullScreen open={open} onClose={onClose}>
      <DialogContent sx={{ p: 2 }}>
        <Card sx={{ p: 2 }}>{children}</Card>
      </DialogContent>
      <Button
        aria-label="close"
        onClick={onClose}
        variant="outlined"
        sx={{
          position: "absolute",
          right: 20,
          top: 8,
          color: (theme: any) => theme.palette.grey[500],
        }}
        startIcon={<Iconify icon="solar:close-circle-outline" />}
      >
        Close
      </Button>
    </Dialog>
  );
}
