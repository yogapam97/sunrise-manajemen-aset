import { useState } from "react";
import { useSnackbar } from "notistack";

import { Box, Card, Chip, Grid, Stack, Typography } from "@mui/material";

import Iconify from "src/components/iconify";
import { LoadingScreen } from "src/components/loading-screen";

import OperationGroupDoForm from "../../core/operation-group/OperationGroupDoForm";
import { useGetOperationGroupById, useCreateOperationGroupDo } from "../../hook/useOperationGroups";
import {
  AUDIT_ICON,
  ASSIGNMENT_ICON,
  RELOCATION_ICON,
  TRANSITION_ICON,
} from "../../core/icon-definitions";

type OperationGroupDoFormContainerProps = {
  workspaceId: string;
  operationGroupId: string;
  onSuccess?: () => void;
};
export default function OperationGroupDoFormContainer({
  workspaceId,
  operationGroupId,
  onSuccess,
}: OperationGroupDoFormContainerProps) {
  const { enqueueSnackbar } = useSnackbar();
  const [submitErrors, setSubmitErrors] = useState<{ field: string; message: string }[]>([]);

  const { data: operationgGroupData, isLoading: operationGroupLoading } =
    useGetOperationGroupById(operationGroupId);

  const operationGroupDoCreateMutation = useCreateOperationGroupDo(operationGroupId, {
    onSuccess: () => {
      enqueueSnackbar("Operation saved", {
        variant: "success",
        anchorOrigin: { horizontal: "center", vertical: "bottom" },
      });
      if (onSuccess) {
        onSuccess();
      }
    },
    onError: (error: any) => {
      if (error.errors.length) {
        setSubmitErrors([{ field: error.errors[0].field, message: error.errors[0].message }]);
      }
    },
  });

  const handleSubmit = (operationGroupPayload: any) => {
    setSubmitErrors([]);
    operationGroupDoCreateMutation.mutate(operationGroupPayload);
  };

  if (operationGroupLoading) {
    return <LoadingScreen message="Loading operation ..." />;
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={4}>
        <OperationGroupDoForm
          workspaceId={workspaceId}
          operationGroup={operationgGroupData?.data}
          submitErrors={submitErrors}
          isLoading={operationGroupDoCreateMutation.isLoading}
          onSubmit={handleSubmit}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <Card sx={{ p: 2 }}>
          <Typography variant="h6">{operationgGroupData?.data?.name}</Typography>
          <Typography variant="body2">{operationgGroupData?.data?.description}</Typography>
          <Stack sx={{ mt: 2 }} spacing={2}>
            {operationgGroupData?.data?.is_assignment && (
              <Box>
                <Chip
                  size="small"
                  icon={<Iconify sx={{ width: 15, height: 15 }} icon={AUDIT_ICON} />}
                  label="Audit"
                  variant="outlined"
                />
              </Box>
            )}
            {operationgGroupData?.data?.is_assignment && (
              <Box>
                <Chip
                  size="small"
                  icon={<Iconify sx={{ width: 15, height: 15 }} icon={ASSIGNMENT_ICON} />}
                  label="Assignment"
                  variant="outlined"
                />
              </Box>
            )}
            {operationgGroupData?.data?.is_relocation && (
              <Box>
                <Chip
                  size="small"
                  icon={<Iconify sx={{ width: 15, height: 15 }} icon={RELOCATION_ICON} />}
                  label="Relocation"
                  variant="outlined"
                />
              </Box>
            )}
            {operationgGroupData?.data?.is_transition && (
              <Box>
                <Chip
                  size="small"
                  icon={<Iconify sx={{ width: 15, height: 15 }} icon={TRANSITION_ICON} />}
                  label="Transition"
                  variant="outlined"
                />
              </Box>
            )}
          </Stack>
        </Card>
      </Grid>
    </Grid>
  );
}
