import { useState } from "react";
import { useSnackbar } from "notistack";

import { LoadingScreen } from "src/components/loading-screen";

import OperationGroupForm from "../../core/operation-group/OperationGroupForm";
import { useUpdateOperationGroup, useGetOperationGroupById } from "../../hook/useOperationGroups";

type OperationGroupEditFormContainerProps = {
  workspaceId: string;
  operationGroupId: string;
  onSuccess?: () => void;
};
export default function OperationGroupEditFormContainer({
  workspaceId,
  operationGroupId,
  onSuccess,
}: OperationGroupEditFormContainerProps) {
  const { enqueueSnackbar } = useSnackbar();
  const [submitErrors, setSubmitErrors] = useState<{ field: string; message: string }[]>([]);

  const { data: operationGroup, isLoading: operationGroupLoading } =
    useGetOperationGroupById(operationGroupId);

  const operationGroupEditMutation = useUpdateOperationGroup(operationGroupId, {
    onSuccess: () => {
      enqueueSnackbar("OperationGroup saved", {
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
    operationGroupEditMutation.mutate(operationGroupPayload);
  };

  if (operationGroupLoading) {
    return <LoadingScreen message="Loading Operation Group ..." />;
  }

  return (
    <OperationGroupForm
      workspaceId={workspaceId}
      submitErrors={submitErrors}
      isLoading={operationGroupEditMutation.isLoading}
      onSubmit={handleSubmit}
      defaultOperationGroup={operationGroup?.data}
    />
  );
}
