"use client";

import * as Yup from "yup";
import { first, isEmpty } from "lodash";
import { useSnackbar } from "notistack";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import PasswordStrengthBar from "react-password-strength-bar";

import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import { Box, Alert } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import LoadingButton from "@mui/lab/LoadingButton";
import InputAdornment from "@mui/material/InputAdornment";

import { paths } from "src/routes/paths";
import { RouterLink } from "src/routes/components";

import { useBoolean } from "src/hooks/use-boolean";

import { SentIcon } from "src/assets/icons";

import Iconify from "src/components/iconify";
import FormProvider, { RHFTextField } from "src/components/hook-form";

// ----------------------------------------------------------------------
type NewPasswordFormType = {
  onSubmit: (data: any) => void;
  submitErrors?: any[];
  loading?: boolean;
  success?: boolean;
};

export default function NewPasswordForm({
  onSubmit,
  submitErrors,
  loading,
  success,
}: NewPasswordFormType) {
  const [score, setScore] = useState<Number>(0);
  const { enqueueSnackbar } = useSnackbar();
  const password = useBoolean();

  const NewPasswordSchema = Yup.object().shape({
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required"),
    password_confirmation: Yup.string()
      .required("Confirm password is required")
      .oneOf([Yup.ref("password")], "Passwords must match"),
  });

  const defaultValues = {
    password: "",
    password_confirmation: "",
  };

  const handleScoreChange = (newScore: Number) => {
    setScore(newScore);
  };

  const methods = useForm({
    resolver: yupResolver(NewPasswordSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    setError,
    getValues,
    watch,
    formState: { errors },
  } = methods;

  watch("password");

  useEffect(() => {
    if (!isEmpty(submitErrors)) {
      submitErrors?.forEach((error) => {
        setError(error.field, { message: error.message });
      });
    }

    if (!isEmpty(errors)) {
      enqueueSnackbar(first(submitErrors)?.message || "Failed Set New Password", {
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
    <Stack spacing={1} alignItems="center">
      {Number(score) < 3 && getValues("password").length >= 6 && (
        <Alert severity="warning" sx={{ textAlign: "left", mb: 1 }}>
          <Typography variant="caption">
            Your password is weak. Please include uppercase letters, numbers, and special characters
            with more than 8 character to make it stronger.
          </Typography>
          <br />
          <Typography variant="caption" sx={{ fontWeight: "bold" }}>
            You can ignore it anyway
          </Typography>
        </Alert>
      )}
      <RHFTextField
        name="password"
        label="Password"
        type={password.value ? "text" : "password"}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={password.onToggle} edge="end">
                <Iconify icon={password.value ? "solar:eye-bold" : "solar:eye-closed-bold"} />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <Box alignItems="left" sx={{ width: "100%" }}>
        {getValues("password") && (
          <PasswordStrengthBar
            minLength={8}
            password={getValues("password")}
            onChangeScore={handleScoreChange}
          />
        )}
      </Box>

      <RHFTextField
        name="password_confirmation"
        label="Confirm New Password"
        type={password.value ? "text" : "password"}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={password.onToggle} edge="end">
                <Iconify icon={password.value ? "solar:eye-bold" : "solar:eye-closed-bold"} />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={loading}>
        Update Password
      </LoadingButton>

      <Link
        component={RouterLink}
        href={paths.auth.login}
        color="inherit"
        variant="subtitle2"
        sx={{
          alignItems: "center",
          display: "inline-flex",
          mt: 2,
        }}
      >
        <Iconify icon="eva:arrow-ios-back-fill" width={16} />
        Return to sign in
      </Link>
    </Stack>
  );

  const renderHead = (
    <>
      <SentIcon sx={{ height: 96 }} />

      <Stack spacing={1} sx={{ mt: 3, mb: 3, px: 8 }}>
        <Typography variant="subtitle1">Set your new password</Typography>

        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          Hope you can get back very soon
        </Typography>
      </Stack>
    </>
  );

  return (
    <FormProvider methods={methods} onSubmit={handleInputSubmit}>
      {renderHead}

      {!success ? (
        renderForm
      ) : (
        <Box alignItems="center" sx={{ width: "100%" }}>
          <Iconify icon="solar:check-circle-bold" color="success.main" />
          <Typography variant="subtitle1">New Password Successfully Set</Typography>
          <Typography variant="body2">Redirecting to login page...</Typography>
        </Box>
      )}
    </FormProvider>
  );
}
