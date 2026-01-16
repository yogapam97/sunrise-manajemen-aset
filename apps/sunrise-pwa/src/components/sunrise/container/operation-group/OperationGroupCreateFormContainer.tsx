import { useState } from "react";
import { useSnackbar } from "notistack";

import { useCreateOperationGroup } from "../../hook/useOperationGroups";
import OperationGroupForm from "../../core/operation-group/OperationGroupForm";

type OperationGroupCreateFormContainerProps = {
  workspaceId: string;
  onSuccess?: () => void;
};
export default function OperationGroupCreateFormContainer({
  workspaceId,
  onSuccess,
}: OperationGroupCreateFormContainerProps) {
  const { enqueueSnackbar } = useSnackbar();
  const [submitErrors, setSubmitErrors] = useState<{ field: string; message: string }[]>([]);

  const operationGroupCreateMutation = useCreateOperationGroup({
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
    operationGroupCreateMutation.mutate(operationGroupPayload);
  };

  return (
    <OperationGroupForm
      workspaceId={workspaceId}
      submitErrors={submitErrors}
      isLoading={operationGroupCreateMutation.isLoading}
      onSubmit={handleSubmit}
    />
  );
}
