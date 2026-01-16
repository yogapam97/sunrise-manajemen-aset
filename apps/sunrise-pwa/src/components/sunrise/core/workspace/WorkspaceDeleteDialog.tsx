import type { IWorkspaceItem } from "src/types/workspace";

import { useState } from "react";
import { useSnackbar } from "notistack";

import { LoadingButton } from "@mui/lab";
import { Box, Stack, TextField, Typography } from "@mui/material";

import ConfirmDialog from "../../common/dialog/ConfirmDialog";
import { useDeleteWorkspace } from "../../hook/useWorkspaces";

type WorkspaceDeleteDialogProps = {
  workspace: IWorkspaceItem | null;
  open: boolean;
  onClose: VoidFunction;
  onDeleted?: VoidFunction;
};

export default function WorkspaceDeleteDialog({
  workspace,
  open,
  onClose,
  onDeleted,
}: WorkspaceDeleteDialogProps) {
  const { enqueueSnackbar } = useSnackbar();
  const name = workspace?.name || "";
  const [enteredName, setEnteredName] = useState("");
  const workspaceDeleteMutation = useDeleteWorkspace({
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

  const handleDeleteWorkspace = async () => {
    await workspaceDeleteMutation.mutateAsync(workspace?.id as string);
  };
  return (
    <ConfirmDialog
      open={open}
      onClose={() => {
        setEnteredName("");
        onClose();
      }}
      title="Delete"
      content={
        <Stack spacing={2}>
          <Box sx={{ color: "text.secondary" }}>
            <Typography variant="subtitle2" sx={{ mt: 1 }}>
              Are you sure you want to delete this workspace?
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            To confirm, type the workspace name.
          </Typography>
          <Typography variant="subtitle2">{name}</Typography>
          <TextField
            onChange={(e) => setEnteredName(e.target.value)}
            fullWidth
            label="Enter workspace name"
            size="small"
          />
        </Stack>
      }
      action={
        <LoadingButton
          loading={workspaceDeleteMutation.isLoading}
          variant="contained"
          color="error"
          onClick={handleDeleteWorkspace}
          disabled={enteredName !== name}
        >
          Delete
        </LoadingButton>
      }
    />
  );
}
