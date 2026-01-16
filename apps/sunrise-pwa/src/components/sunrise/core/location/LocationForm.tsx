import type { ILocationItem, ILocationPayload } from "src/types/location";

import _ from "lodash";
import * as Yup from "yup";
import { useSnackbar } from "notistack";
import { useForm } from "react-hook-form";
import { useMemo, useEffect } from "react";
import { yupResolver } from "@hookform/resolvers/yup";

import { LoadingButton } from "@mui/lab";
import { Card, Stack, Typography } from "@mui/material";

import { stopPropagate } from "src/utils/stopPropagate";

import { RHFTextField } from "src/components/hook-form";
import FormProvider from "src/components/hook-form/form-provider";

type LocationFormProps = {
  defaultLocation?: ILocationItem;
  onSubmit: (location: ILocationPayload) => void;
  isLoading?: boolean;
  submitErrors?: any[];
};

const LocationSchema: Yup.ObjectSchema<ILocationPayload> = Yup.object().shape({
  name: Yup.string()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(60, "Name cannot be longer than 60 characters"),
  code: Yup.string()
    .nullable()
    .max(60, "Code cannot be longer than 60 characters")
    .matches(/^[^\s]*$/, { message: "Code must not contain spaces" }),
  address: Yup.string().nullable(),
  description: Yup.string().nullable(),
});

export default function LocationForm({
  onSubmit,
  defaultLocation,
  isLoading,
  submitErrors,
}: LocationFormProps) {
  const defaultValues: ILocationPayload = useMemo(
    () => ({
      name: defaultLocation?.name || "",
      code: defaultLocation?.code || "",
      address: defaultLocation?.address || "",
      description: defaultLocation?.description || "",
    }),
    [defaultLocation]
  );

  const { enqueueSnackbar } = useSnackbar();

  const methods = useForm({
    resolver: yupResolver(LocationSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    setError,
    formState: { errors },
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

  const handleInputSubmit = handleSubmit(async (values: ILocationPayload) => onSubmit(values));

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
              placeholder="Enter location name ..."
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
              placeholder="Enter location code ..."
            />
          </Stack>

          <Stack spacing={2}>
            <Typography variant="subtitle2">Address</Typography>
            <RHFTextField
              name="address"
              error={!!errors.address}
              helperText={errors.address?.message}
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              placeholder="Enter location address ..."
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
              placeholder="Enter location description ..."
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
              Save Location
            </LoadingButton>
          </Stack>
        </Stack>
      </FormProvider>
    </Card>
  );
}
