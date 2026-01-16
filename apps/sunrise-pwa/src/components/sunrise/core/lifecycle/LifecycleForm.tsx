import type { ILifecycleItem, ILifecyclePayload } from "src/types/lifecycle";

import _ from "lodash";
import * as Yup from "yup";
import { useSnackbar } from "notistack";
import { useMemo, useEffect } from "react";
import { TwitterPicker } from "react-color";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";

import { LoadingButton } from "@mui/lab";
import { Card, Stack, Switch, Typography, FormControlLabel } from "@mui/material";

import { stopPropagate } from "src/utils/stopPropagate";

import Iconify from "src/components/iconify";
import { RHFTextField } from "src/components/hook-form";
import FormProvider from "src/components/hook-form/form-provider";

import { MAINTENANCE_ICON } from "../icon-definitions";

type LifecycleFormProps = {
  defaultLifecycle?: ILifecycleItem;
  onSubmit: (lifecycle: ILifecyclePayload) => void;
  submitErrors?: any[];
  isLoading?: boolean;
};

const LifecycleSchema: Yup.ObjectSchema<ILifecyclePayload> = Yup.object().shape({
  name: Yup.string()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(60, "Name cannot be longer than 60 characters"),
  code: Yup.string()
    .nullable()
    .max(60, "Code cannot be longer than 60 characters")
    .matches(/^[^\s]*$/, { message: "Code must not contain spaces" }),
  color: Yup.string().nullable(),
  is_maintenance_cycle: Yup.boolean().nullable(),
  description: Yup.string().nullable(),
});

export default function LifecycleForm({
  onSubmit,
  defaultLifecycle,
  isLoading,
  submitErrors,
}: LifecycleFormProps) {
  const defaultValues: ILifecyclePayload = useMemo(
    () => ({
      name: defaultLifecycle?.name || "",
      code: defaultLifecycle?.code || "",
      color: defaultLifecycle?.color || "",
      is_maintenance_cycle: defaultLifecycle?.is_maintenance_cycle || false,
      description: defaultLifecycle?.description || "",
    }),
    [defaultLifecycle]
  );

  const methods = useForm({
    resolver: yupResolver(LifecycleSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
    setError,
  } = methods;

  const { enqueueSnackbar } = useSnackbar();

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

  const handleInputSubmit = handleSubmit(async (values: ILifecyclePayload) => onSubmit(values));

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
              placeholder="Enter lifecycle name ..."
            />
          </Stack>

          <Stack spacing={2}>
            <Typography variant="subtitle2">Code</Typography>
            <RHFTextField
              name="code"
              error={!!errors.code}
              helperText={errors.code?.message}
              fullWidth
              variant="outlined"
              placeholder="Enter lifecycle code ..."
            />
          </Stack>

          <Stack spacing={2}>
            <Typography variant="subtitle2">Color</Typography>
            <Controller
              name="color"
              render={({ field }) => (
                <TwitterPicker
                  styles={{
                    default: {
                      card: { backgroundColor: "transparent", padding: 0 },
                    },
                  }}
                  triangle="hide"
                  color={field.value}
                  onChange={(color: any) => field.onChange(color.hex)}
                />
              )}
            />
          </Stack>

          <Stack sx={{ my: 2 }} spacing={2}>
            <FormControlLabel
              control={
                <Switch
                  defaultChecked={getValues("is_maintenance_cycle")}
                  onChange={(e) => setValue("is_maintenance_cycle", e.target.checked as never)}
                />
              }
              label={
                <Stack direction="row" spacing={1} alignItems="center">
                  <Iconify icon={MAINTENANCE_ICON} />
                  <Typography variant="subtitle2">Set as Maintenance Cycle</Typography>
                </Stack>
              }
            />
          </Stack>

          <Stack spacing={2}>
            <Typography variant="subtitle2">Description</Typography>
            <RHFTextField
              name="description"
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              placeholder="Enter lifecycle description ..."
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
              Save Lifecycle
            </LoadingButton>
          </Stack>
        </Stack>
      </FormProvider>
    </Card>
  );
}
