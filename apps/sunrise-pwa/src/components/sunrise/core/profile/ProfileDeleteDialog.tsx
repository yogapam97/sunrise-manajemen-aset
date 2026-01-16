import { useSnackbar } from "notistack";

import { LoadingButton } from "@mui/lab";
import { Box, Typography } from "@mui/material";

import { useDeleteProfile } from "../../hook/useAuth";
import ConfirmDialog from "../../common/dialog/ConfirmDialog";

type ProfileDeleteDialogProps = {
  open: boolean;
  onClose: VoidFunction;
  onDeleted?: VoidFunction;
};

export default function ProfileDeleteDialog({
  open,
  onClose,
  onDeleted,
}: ProfileDeleteDialogProps) {
  const { enqueueSnackbar } = useSnackbar();
  const profileMutation = useDeleteProfile({
    onSuccess: () => {
      enqueueSnackbar("We gonna miss you, hope we can work together again", {
        variant: "success",
        anchorOrigin: { vertical: "bottom", horizontal: "center" },
      });
      onClose();
      if (onDeleted) {
        onDeleted();
      }
    },
  });

  const handleDeleteProfile = async () => {
    await profileMutation.mutateAsync();
  };
  return (
    <ConfirmDialog
      open={open}
      onClose={onClose}
      title="Delete"
      content={
        <Box sx={{ color: "text.secondary" }}>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Are you sure you want to leave this app?
          </Typography>
        </Box>
      }
      action={
        <LoadingButton
          loading={profileMutation.isLoading}
          variant="outlined"
          color="error"
          onClick={handleDeleteProfile}
        >
          Yes I want to leave
        </LoadingButton>
      }
    />
  );
}
