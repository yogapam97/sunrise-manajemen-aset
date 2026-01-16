import { Box, Dialog, IconButton, DialogTitle, DialogContent } from "@mui/material";

import Iconify from "src/components/iconify";

type CommonDialogProps = {
  children: React.ReactNode;
  open: any;
  title?: string;
  onClose: VoidFunction;
};
export default function CommonDialog({ open, onClose, title, children }: CommonDialogProps) {
  return (
    <Dialog fullWidth open={open} scroll="body" onClose={onClose}>
      <DialogTitle align="center" variant="subtitle2">
        {title || ""}
      </DialogTitle>
      <DialogContent sx={{ alignItems: "center", justifyContent: "center" }}>
        <Box sx={{ p: 2 }}>{children}</Box>
      </DialogContent>
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: (theme: any) => theme.palette.grey[500],
        }}
      >
        <Iconify icon="solar:close-circle-outline" />
      </IconButton>
    </Dialog>
  );
}
