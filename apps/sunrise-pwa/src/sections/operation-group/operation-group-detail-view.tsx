"use client";

import type { IOperationGroupItem } from "src/types/operation-group";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { Box, Grid, Button, Container, Typography } from "@mui/material";

import { paths } from "src/routes/paths";
import { RouterLink } from "src/routes/components";

import { useBoolean } from "src/hooks/use-boolean";

import { deleteOperationGroup, getOperationGroupById } from "src/api/operation-group-api";

import { useSettingsContext } from "src/components/settings";
import { LoadingScreen } from "src/components/loading-screen";
import PageHeader from "src/components/sunrise/common/PageHeader";
import ConfirmDialog from "src/components/sunrise/common/dialog/ConfirmDialog";
import OperationGroupDetailContainer from "src/components/sunrise/container/operation-group/OperationGroupDetailContainer";

import { useWorkspaceContext } from "src/auth/hooks";

type OperationGroupDetailViewProps = {
  operationGroupId: string;
  workspaceId: string;
};

export default function OperationGroupDetailView({
  operationGroupId,
  workspaceId,
}: OperationGroupDetailViewProps) {
  let operationGroup: IOperationGroupItem = {} as IOperationGroupItem;

  const settings = useSettingsContext();
  const { workspace } = useWorkspaceContext();
  const deleteDialog = useBoolean();
  const { push } = useRouter();
  const queryClient = useQueryClient();
  const deleteConfirm = useBoolean();

  const {
    data,
    isLoading: isDeleteLoading,
    isSuccess,
  } = useQuery({
    queryKey: ["categories", operationGroupId],
    queryFn: () => getOperationGroupById(operationGroupId),
  });

  if (isSuccess) {
    ({ data: operationGroup } = data);
  }

  const { mutate, isLoading } = useMutation(() => deleteOperationGroup(operationGroupId), {
    onSuccess: () => {
      push(`${paths.app.operationGroup.root(workspace?.id as string)}`);
      queryClient.invalidateQueries(["categories"]);
    },
  });

  const handleDeleteOperationGroup = useCallback(() => {
    mutate();
    deleteDialog.onFalse();
  }, [mutate, deleteDialog]);

  if (isLoading || isDeleteLoading) {
    return <LoadingScreen height="50vh" message="Loading Operation Group ..." />;
  }

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : "xl"}>
        <PageHeader
          withBackButton
          action={
            <Button
              variant="contained"
              component={RouterLink}
              href={paths.app.operationGroup.edit(workspace?.id as string, operationGroupId)}
            >
              Edit Operation Group
            </Button>
          }
        />
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={12} md={12}>
            <OperationGroupDetailContainer
              workspaceId={workspaceId}
              operationGroupId={operationGroupId}
            />
          </Grid>
        </Grid>
      </Container>
      <ConfirmDialog
        open={deleteConfirm.value}
        onClose={deleteConfirm.onFalse}
        title="Delete"
        content={
          <Box sx={{ color: "text.secondary" }}>
            <Typography variant="subtitle2">{operationGroup?.name}</Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Are you sure you want to delete this operationGroup?
            </Typography>
          </Box>
        }
        action={
          <Button variant="contained" color="error" onClick={handleDeleteOperationGroup}>
            Delete
          </Button>
        }
      />
    </>
  );
}
