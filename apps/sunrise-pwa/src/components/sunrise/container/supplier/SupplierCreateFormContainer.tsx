import type { ISupplierPayload } from "src/types/supplier";

import { useSnackbar } from "notistack";
import { useState, useCallback } from "react";

import SupplierForm from "../../core/supplier/SupplierForm";
import { useCreateSupplier } from "../../hook/useSuppliers";

type SupplierCreateFormContainerProps = {
  workspaceId: string;
  onSuccess?: (response: any) => void;
};

export default function SupplierCreateFormContainer({
  workspaceId,
  onSuccess,
}: SupplierCreateFormContainerProps) {
  const { enqueueSnackbar } = useSnackbar();
  const [submitErrors, setSubmitErrors] = useState<{ field: string; message: string }[]>([]);
  const supplierMutation = useCreateSupplier({
    onSuccess: (response: any) => {
      enqueueSnackbar("Supplier created", {
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
    (supplierPayload: ISupplierPayload) => {
      setSubmitErrors([]);
      supplierMutation.mutate(supplierPayload);
    },
    [supplierMutation]
  );

  return (
    <SupplierForm
      isLoading={supplierMutation.isLoading}
      onSubmit={handleSubmit}
      submitErrors={submitErrors}
    />
  );
}
