import type { ISupplierItem, ISupplierPayload } from "src/types/supplier";

import _ from "lodash";
import * as Yup from "yup";
import { useSnackbar } from "notistack";
import { useForm } from "react-hook-form";
import { useMemo, useEffect } from "react";
import { yupResolver } from "@hookform/resolvers/yup";

import { LoadingButton } from "@mui/lab";
import { Card, Stack, Typography, InputAdornment } from "@mui/material";

import { stopPropagate } from "src/utils/stopPropagate";

import Iconify from "src/components/iconify";
import { RHFTextField } from "src/components/hook-form";
import FormProvider from "src/components/hook-form/form-provider";

type SupplierFormProps = {
  defaultSupplier?: ISupplierItem;
  onSubmit: (supplier: ISupplierPayload) => void;
  isLoading?: boolean;
  submitErrors?: any[];
};

const SupplierSchema: Yup.ObjectSchema<ISupplierPayload> = Yup.object().shape({
  name: Yup.string()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(60, "Name cannot be longer than 60 characters"),
  code: Yup.string()
    .nullable()
    .max(60, "Code cannot be longer than 60 characters")
    .matches(/^[^\s]*$/, { message: "Code must not contain spaces" }),
  email: Yup.string().nullable().email("Must be a valid email address"),
  phone: Yup.string()
    .nullable()
    .matches(/^[0-9\-+\s()]*$/, "Phone number can only contain numbers and the symbols - + ( )"),
  url: Yup.string().nullable().url("Must be a valid URL"),
  address: Yup.string().nullable().max(100, "Address cannot be longer than 100 characters"),
  description: Yup.string().nullable().max(500, "Description cannot be longer than 500 characters"),
});

export default function SupplierForm({
  onSubmit,
  defaultSupplier,
  isLoading,
  submitErrors,
}: SupplierFormProps) {
  const defaultValues: ISupplierPayload = useMemo(
    () => ({
      name: defaultSupplier?.name || "",
      code: defaultSupplier?.code || "",
      address: defaultSupplier?.address || "",
      description: defaultSupplier?.description || "",
      email: defaultSupplier?.email || "",
      phone: defaultSupplier?.phone || "",
      url: defaultSupplier?.url || "",
    }),
    [defaultSupplier]
  );

  const { enqueueSnackbar } = useSnackbar();

  const methods = useForm({
    resolver: yupResolver(SupplierSchema),
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

  const handleInputSubmit = handleSubmit(async (values: ISupplierPayload) => onSubmit(values));

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
              placeholder="Enter supplier name ..."
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
              placeholder="Enter supplier code ..."
            />
          </Stack>

          <Stack spacing={2}>
            <Typography variant="subtitle2">Email</Typography>
            <RHFTextField
              name="email"
              error={!!errors.email}
              helperText={errors.email?.message}
              fullWidth
              variant="outlined"
              placeholder="Enter supplier email ..."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Iconify icon="mdi:email-outline" />
                  </InputAdornment>
                ),
              }}
            />
          </Stack>

          <Stack spacing={2}>
            <Typography variant="subtitle2">Phone</Typography>
            <RHFTextField
              name="phone"
              error={!!errors.phone}
              helperText={errors.phone?.message}
              fullWidth
              variant="outlined"
              placeholder="Enter supplier phone ..."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Iconify icon="mdi:phone-outline" />
                  </InputAdornment>
                ),
              }}
            />
          </Stack>

          <Stack spacing={2}>
            <Typography variant="subtitle2">Website</Typography>
            <RHFTextField
              name="url"
              error={!!errors.url}
              helperText={errors.url?.message}
              fullWidth
              variant="outlined"
              placeholder="Enter supplier website URL ..."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Iconify icon="mdi:web" />
                  </InputAdornment>
                ),
              }}
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
              placeholder="Enter supplier address ..."
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
              placeholder="Enter supplier description ..."
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
              Save Supplier
            </LoadingButton>
          </Stack>
        </Stack>
      </FormProvider>
    </Card>
  );
}
