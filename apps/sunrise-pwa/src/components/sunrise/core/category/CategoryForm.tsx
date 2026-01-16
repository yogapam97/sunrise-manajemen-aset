import type { ICategoryItem, ICategoryPayload } from "src/types/category";

import _ from "lodash";
import * as Yup from "yup";
import { useSnackbar } from "notistack";
import { useMemo, useEffect } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";

import { LoadingButton } from "@mui/lab";
import { Card, Stack, Typography } from "@mui/material";

import { stopPropagate } from "src/utils/stopPropagate";

import { RHFTextField } from "src/components/hook-form";
import FormProvider from "src/components/hook-form/form-provider";

import IconSelector from "../../common/icon-selector/IconSelector";

type CategoryFormProps = {
  defaultCategory?: ICategoryItem;
  onSubmit: (location: ICategoryPayload) => void;
  isLoading?: boolean;
  submitErrors?: any[];
};

const CategorySchema: Yup.ObjectSchema<ICategoryPayload> = Yup.object().shape({
  name: Yup.string()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(60, "Name cannot be longer than 60 characters"),
  code: Yup.string()
    .nullable()
    .max(60, "Code cannot be longer than 60 characters")
    .matches(/^[^\s]*$/, { message: "Code must not contain spaces" }),
  icon: Yup.string().nullable(),
  description: Yup.string().nullable(),
});

export default function CategoryForm({
  defaultCategory,
  onSubmit,
  isLoading,
  submitErrors,
}: CategoryFormProps) {
  const defaultValues: ICategoryPayload = useMemo(
    () => ({
      name: defaultCategory?.name || "",
      code: defaultCategory?.code || "",
      icon: defaultCategory?.icon || "codicon:tools",
      description: defaultCategory?.description || "",
    }),
    [defaultCategory]
  );

  const { enqueueSnackbar } = useSnackbar();

  const methods = useForm({
    resolver: yupResolver(CategorySchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { errors },
    setError,
  } = methods;

  useEffect(() => {
    if (!_.isEmpty(submitErrors)) {
      submitErrors?.forEach((error) => {
        setError(error.field, { message: error.message });
      });
    }

    if (!_.isEmpty(errors)) {
      enqueueSnackbar("Please check again your input", {
        variant: "error",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "center",
        },
      });
    }
  }, [setError, submitErrors, errors, enqueueSnackbar]);

  const handleInputSubmit = handleSubmit(async (values: ICategoryPayload) => onSubmit(values));

  return (
    <Card sx={{ p: 2 }}>
      <FormProvider methods={methods} onSubmit={stopPropagate(handleInputSubmit) as VoidFunction}>
        <Stack spacing={2}>
          <Stack spacing={2}>
            <Typography variant="subtitle2">Name</Typography>
            <RHFTextField
              name="name"
              error={!!errors.name}
              helperText={errors.name?.message}
              fullWidth
              variant="outlined"
              placeholder="Enter category name ..."
            />
          </Stack>
          <Stack spacing={2}>
            <Typography variant="subtitle2">Code</Typography>
            <RHFTextField
              name="code"
              fullWidth
              variant="outlined"
              placeholder="Enter category code ..."
            />
          </Stack>
          <Stack spacing={2}>
            <Typography variant="subtitle2">Icon</Typography>
            <Controller name="icon" render={({ field }) => <IconSelector {...field} />} />
          </Stack>
          <Stack spacing={2}>
            <Typography variant="subtitle2">Description</Typography>
            <RHFTextField
              name="description"
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              placeholder="Enter category description ..."
            />
          </Stack>
          <Stack spacing={2}>
            <LoadingButton
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              loading={isLoading}
            >
              Save Category
            </LoadingButton>
          </Stack>
        </Stack>
      </FormProvider>
    </Card>
  );
}
