import type { ICategoryPayload } from "src/types/category";

import { useSnackbar } from "notistack";
import { useState, useCallback } from "react";

import CategoryForm from "../../core/category/CategoryForm";
import { useCreateCategory } from "../../hook/useCategories";

type CategoryCreateFormContainerProps = {
  workspaceId: string;
  onSuccess?: (response: any) => void;
};

export default function CategoryCreateFormContainer({
  workspaceId,
  onSuccess,
}: CategoryCreateFormContainerProps) {
  const { enqueueSnackbar } = useSnackbar();
  const [submitErrors, setSubmitErrors] = useState<{ field: string; message: string }[]>([]);
  const categoryMutation = useCreateCategory({
    onSuccess: (response: any) => {
      enqueueSnackbar("Category created", {
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
    (categoryPayload: ICategoryPayload) => {
      setSubmitErrors([]);
      categoryMutation.mutate(categoryPayload);
    },
    [categoryMutation]
  );

  return (
    <CategoryForm
      isLoading={categoryMutation.isLoading}
      onSubmit={handleSubmit}
      submitErrors={submitErrors}
    />
  );
}
