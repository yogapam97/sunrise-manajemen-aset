import type { ILifecyclePayload } from "src/types/lifecycle";

import { useSnackbar } from "notistack";
import { useState, useCallback } from "react";

import { useCreateLifecycle } from "../../hook/useLifecycles";
import LifecycleForm from "../../core/lifecycle/LifecycleForm";

type LifecycleCreateFormContainerProps = {
  workspaceId: string;
  onSuccess?: (response: any) => void;
};

export default function LifecycleCreateFormContainer({
  workspaceId,
  onSuccess,
}: LifecycleCreateFormContainerProps) {
  const { enqueueSnackbar } = useSnackbar();
  const [submitErrors, setSubmitErrors] = useState<{ field: string; message: string }[]>([]);
  const lifecycleMutation = useCreateLifecycle({
    onSuccess: (response: any) => {
      enqueueSnackbar("Lifecycle created", {
        variant: "success",
        anchorOrigin: { horizontal: "center", vertical: "bottom" },
      });
      if (onSuccess) {
        onSuccess(response);
      }
    },
    onError: (error: any) => {
      if (error.errors.length) {
        setSubmitErrors([{ field: error.errors[0].field, message: error.errors[0].message }]);
      }
    },
  });

  const handleSubmit = useCallback(
    (lifecyclePayload: ILifecyclePayload) => {
      setSubmitErrors([]);
      lifecycleMutation.mutate(lifecyclePayload);
    },
    [lifecycleMutation]
  );

  return (
    <LifecycleForm
      isLoading={lifecycleMutation.isLoading}
      onSubmit={handleSubmit}
      submitErrors={submitErrors}
    />
  );
}
