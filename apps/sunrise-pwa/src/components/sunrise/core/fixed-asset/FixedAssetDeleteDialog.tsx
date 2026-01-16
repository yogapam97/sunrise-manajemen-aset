import type { IFixedAssetItem } from "src/types/fixed-asset";

import { useSnackbar } from "notistack";

import { LoadingButton } from "@mui/lab";
import { Box, Typography } from "@mui/material";

import ConfirmDialog from "../../common/dialog/ConfirmDialog";
import { useDeleteFixedAsset } from "../../hook/useFixedAssets";

type FixedAssetDeleteDialogProps = {
  fixedAsset: IFixedAssetItem;
  open: boolean;
  onClose: VoidFunction;
  onDeleted?: VoidFunction;
};

export default function FixedAssetDeleteDialog({
  fixedAsset,
  open,
  onClose,
  onDeleted,
}: FixedAssetDeleteDialogProps) {
  const { enqueueSnackbar } = useSnackbar();
  const { name } = fixedAsset;
  const fixedAssetDeleteMutation = useDeleteFixedAsset({
    onSuccess: () => {
      enqueueSnackbar("Fixed asset deleted", {
        variant: "success",
        anchorOrigin: { vertical: "bottom", horizontal: "center" },
      });
      onClose();
      if (onDeleted) {
        onDeleted();
      }
    },
  });

  const handleDeleteFixedAsset = async () => {
    await fixedAssetDeleteMutation.mutateAsync(fixedAsset.id);
  };
  return (
    <ConfirmDialog
      open={open}
      onClose={onClose}
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
        <LoadingButton
          loading={fixedAssetDeleteMutation.isLoading}
          variant="contained"
          color="error"
          onClick={handleDeleteFixedAsset}
        >
          Delete
        </LoadingButton>
      }
    />
  );
}
