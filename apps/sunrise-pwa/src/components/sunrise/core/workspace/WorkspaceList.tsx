//
import type { IPagination } from "src/types/pagination";
// types
import type { IWorkspaceItem } from "src/types/workspace";

import { useState, useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// @mui
import Box from "@mui/material/Box";
// routes
import { LoadingButton } from "@mui/lab";
import Pagination, { paginationClasses } from "@mui/material/Pagination";

import { paths } from "src/routes/paths";
import { useRouter } from "src/routes/hooks";

import { deleteWorkspace } from "src/api/workspace-api";

import { LoadingScreen } from "src/components/loading-screen";
import EmptyContent from "src/components/empty-content/empty-content";

import WorkspaceItem from "./WorkspaceItem";
import ConfirmDialog from "../../common/dialog/ConfirmDialog";

// ----------------------------------------------------------------------

type Props = {
  workspaces: IWorkspaceItem[];
  pagination: IPagination;
  isLoading: boolean;
  onJoinWorkspace: (workspaceId: string) => void;
  onRejectWorkspace: (workspaceId: string) => void;
};

export default function WorkspaceList({
  workspaces,
  pagination,
  isLoading,
  onJoinWorkspace,
  onRejectWorkspace,
}: Props) {
  const router = useRouter();
  const [workspaceToDelete, setWorkspaceToDelete] = useState<IWorkspaceItem | null>(null);
  const queryClient = useQueryClient();
  const deleteMutation = useMutation(deleteWorkspace, {
    onSuccess: () => {
      queryClient.invalidateQueries(["workspaces"]);
    },
  });

  const handleView = useCallback(
    (id: string) => {
      router.push(paths.workspace.detail(id));
    },
    [router]
  );

  const handleEdit = useCallback(
    (id: string) => {
      router.push(paths.workspace.edit(id));
    },
    [router]
  );

  const handleOpenDeleteDialog = useCallback((workspace: IWorkspaceItem) => {
    setWorkspaceToDelete(workspace);
  }, []);

  const handleDelete = useCallback(async () => {
    if (workspaceToDelete) {
      await deleteMutation.mutateAsync(workspaceToDelete.id as string);
      setWorkspaceToDelete(null);
    }
  }, [deleteMutation, workspaceToDelete]);

  return (
    <>
      <Box
        gap={3}
        display="grid"
        gridTemplateColumns={{
          xs: "repeat(1, 1fr)",
          sm: "repeat(2, 1fr)",
          md: "repeat(3, 1fr)",
        }}
      >
        {isLoading ? (
          <LoadingScreen />
        ) : (
          workspaces.length > 0 &&
          workspaces.map((workspace: IWorkspaceItem) => (
            <WorkspaceItem
              key={workspace.id}
              workspace={workspace}
              onView={() => handleView(workspace.id as string)}
              onEdit={() => handleEdit(workspace.id as string)}
              onDelete={() => handleOpenDeleteDialog(workspace)}
              onJoinWorkspace={onJoinWorkspace}
              onRejectWorkspace={onRejectWorkspace}
            />
          ))
        )}
        {workspaces?.length === 0 && <EmptyContent filled title="No Data" sx={{ py: 10 }} />}
      </Box>
      {!isLoading && (pagination?.totalDocs as number) > 12 && !isLoading && (
        <Pagination
          count={pagination.totalPages}
          sx={{
            mt: 8,
            [`& .${paginationClasses.ul}`]: {
              justifyContent: "center",
            },
          }}
        />
      )}
      <ConfirmDialog
        open={Boolean(workspaceToDelete)}
        onClose={() => setWorkspaceToDelete(null)}
        title="Delete Workspace"
        content="Are you sure?"
        disableCancelButton={deleteMutation?.isLoading}
        action={
          <LoadingButton
            loading={deleteMutation?.isLoading}
            variant="contained"
            color="error"
            onClick={handleDelete}
          >
            Delete
          </LoadingButton>
        }
      />
    </>
  );
}
