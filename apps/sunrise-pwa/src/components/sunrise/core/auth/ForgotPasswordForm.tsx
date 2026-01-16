"use client";

import * as Yup from "yup";
import { isEmpty } from "lodash";
import { useEffect } from "react";
import { useSnackbar } from "notistack";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { Box } from "@mui/material";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import LoadingButton from "@mui/lab/LoadingButton";

import { paths } from "src/routes/paths";
import { RouterLink } from "src/routes/components";

import { PasswordIcon } from "src/assets/icons";

import Iconify from "src/components/iconify";
import FormProvider, { RHFTextField } from "src/components/hook-form";

// ----------------------------------------------------------------------

type ForgotPasswordFormProps = {
  onSubmit: (data: any) => void;
  submitErrors?: any[];
  loading?: boolean;
  success?: boolean;
};

export default function ForgotPasswordForm({
  onSubmit,
  submitErrors,
  loading,
  success,
}: ForgotPasswordFormProps) {
  const { enqueueSnackbar } = useSnackbar();
  const ForgotPasswordSchema = Yup.object().shape({
    email: Yup.string().required("Email is required").email("Email must be a valid email address"),
  });

  const defaultValues = {
    email: "",
  };

  const methods = useForm({
    resolver: yupResolver(ForgotPasswordSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    setError,
    formState: { errors },
  } = methods;

  useEffect(() => {
    if (!isEmpty(submitErrors)) {
      submitErrors?.forEach((error) => {
        setError(error.field, { message: error.message });
      });
    }

    if (!isEmpty(errors)) {
      enqueueSnackbar("Failed Forgot Password", {
        variant: "error",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "center",
        },
      });
    }
  }, [setError, submitErrors, errors, enqueueSnackbar]);

  const handleInputSubmit = handleSubmit(async (values: any) => onSubmit(values));

  const renderForm = (
    <Stack spacing={3} alignItems="center">
      {!success ? (
        <Stack spacing={3} alignItems="center" sx={{ width: "100%" }}>
          <RHFTextField name="email" label="Email address" />

          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            loading={loading}
            endIcon={<Iconify icon="eva:arrow-ios-forward-fill" />}
            sx={{ justifyContent: "space-between", pl: 2, pr: 1.5 }}
          >
            Send Request
          </LoadingButton>
        </Stack>
      ) : (
        <Box alignItems="center" sx={{ width: "100%" }}>
          <Iconify icon="solar:check-circle-bold" color="success.main" />
          <Typography variant="subtitle1">Password reset email sent</Typography>
        </Box>
      )}

      <Link
        component={RouterLink}
        href={paths.auth.login}
        color="inherit"
        variant="subtitle2"
        sx={{
          alignItems: "center",
          display: "inline-flex",
        }}
      >
        <Iconify icon="eva:arrow-ios-back-fill" width={16} />
        Return to sign in
      </Link>
    </Stack>
  );

  const renderHead = (
    <>
      <PasswordIcon sx={{ height: 96 }} />

      <Stack spacing={1} sx={{ mt: 3, mb: 5 }}>
        <Typography variant="h3">Forgot your password?</Typography>

        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          Please enter the email address associated with your account and We will email you a link
          to reset your password.
        </Typography>
      </Stack>
    </>
  );

  return (
    <FormProvider methods={methods} onSubmit={handleInputSubmit}>
      {renderHead}

      {renderForm}
    </FormProvider>
  );
}
