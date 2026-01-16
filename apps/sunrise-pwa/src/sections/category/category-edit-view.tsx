"use client";

import type { ICategoryItem, ICategoryPayload } from "src/types/category";

import { useSnackbar } from "notistack";
import { useRouter } from "next/navigation";
import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { Grid, Container } from "@mui/material";

import { paths } from "src/routes/paths";

import { updateCategory, getCategoryIdById } from "src/api/category-api";

import { useSettingsContext } from "src/components/settings";
import { LoadingScreen } from "src/components/loading-screen";
import PageHeader from "src/components/sunrise/common/PageHeader";
import CategoryForm from "src/components/sunrise/core/category/CategoryForm";

import { useWorkspaceContext } from "src/auth/hooks";

type CategoryEditViewProps = {
  categoryId: string;
};

export default function CategoryEditView({ categoryId }: CategoryEditViewProps) {
  let defaultCategory: ICategoryItem = {} as ICategoryItem;
  const settings = useSettingsContext();
  const { workspace } = useWorkspaceContext();
  const [isNavigating, setIsNavigating] = useState(false);
  const { push } = useRouter();
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const [submitErrors, setSubmitErrors] = useState<{ field: string; message: string }[]>([]);

  const {
    data,
    isSuccess,
    isLoading: loadCategoryLoading,
  } = useQuery({
    queryKey: ["categories", categoryId],
    queryFn: () => getCategoryIdById(categoryId),
  });

  if (isSuccess) {
    ({ data: defaultCategory } = data);
  }

  const categoryMutation = useMutation(
    (category: ICategoryPayload) => updateCategory(defaultCategory?.id as string, category),
    {
      onSuccess: () => {
        enqueueSnackbar("Category updated", {
          variant: "success",
          anchorOrigin: { horizontal: "center", vertical: "bottom" },
        });
        setIsNavigating(true);
        push(`${paths.app.category.root(workspace?.id as string)}`);
        queryClient.invalidateQueries(["categories"]);
      },
      onError: (error: any) => {
        if (error.errors.length) {
          setSubmitErrors([{ field: error.errors[0].field, message: error.errors[0].message }]);
        }
      },
    }
  );
  const handleSubmit = useCallback(
    (categoryPayload: ICategoryPayload) => {
      setSubmitErrors([]);
      categoryMutation.mutate(categoryPayload);
    },
    [categoryMutation]
  );

  if (loadCategoryLoading || isNavigating) {
    return <LoadingScreen height="50vh" message="Loading Category ..." />;
  }

  return (
    <Container maxWidth={settings.themeStretch ? false : "xl"}>
      <PageHeader withBackButton />
      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={12} md={4}>
          {isSuccess && (
            <CategoryForm
              isLoading={categoryMutation.isLoading}
              onSubmit={handleSubmit}
              defaultCategory={defaultCategory}
              submitErrors={submitErrors}
            />
          )}
        </Grid>
      </Grid>
    </Container>
  );
}
