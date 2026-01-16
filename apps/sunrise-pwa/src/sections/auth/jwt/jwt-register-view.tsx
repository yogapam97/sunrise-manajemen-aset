"use client";

import type { ErrorResponse } from "src/types/error-response";

import * as Yup from "yup";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import PasswordStrengthBar from "react-password-strength-bar";

import Link from "@mui/material/Link";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
// @mui
import LoadingButton from "@mui/lab/LoadingButton";
import InputAdornment from "@mui/material/InputAdornment";

// routes
import { paths } from "src/routes/paths";
import { useRouter } from "src/routes/hooks";
import { RouterLink } from "src/routes/components";

// hooks
import { useBoolean } from "src/hooks/use-boolean";

// components
import Iconify from "src/components/iconify";
import FormProvider, { RHFTextField } from "src/components/hook-form";

// auth
import { useAuthContext } from "src/auth/hooks";

// ----------------------------------------------------------------------

export default function JwtRegisterView() {
  const { register } = useAuthContext();
  const [registerLoading, setRegisterLoading] = useState(false);

  const router = useRouter();

  const [errorMsg, setErrorMsg] = useState("");

  const password = useBoolean();

  const RegisterSchema = Yup.object().shape({
    name: Yup.string().required("Name required"),
    email: Yup.string().required("Email is required").email("Email must be a valid email address"),
    password: Yup.string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters long"),
  });

  const defaultValues = {
    name: "",
    email: "",
    password: "",
  };

  const methods = useForm({
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });

  const { setError, handleSubmit, watch, getValues } = methods;

  watch("password");

  const onSubmit = handleSubmit(async (data) => {
    try {
      setRegisterLoading(true);
      await register?.(data.email, data.password, data.name);
      router.push(paths.workspace.root);
    } catch (error) {
      setRegisterLoading(false);
      setErrorMsg(error.message);
      const emailError = error.errors.find(
        (errorResponse: ErrorResponse) => errorResponse.field === "email"
      );
      if (emailError) {
        setError("email", { message: emailError.message });
      }
      const passwordError = error.errors.find(
        (errorResponse: ErrorResponse) => errorResponse.field === "password"
      );
      if (passwordError) {
        setError("password", { message: passwordError.message });
      }
    }
  });

  const renderHead = (
    <Stack spacing={2} sx={{ mb: 5, position: "relative" }}>
      <Typography variant="h4">Get started absolutely free</Typography>

      <Stack direction="row" spacing={0.5}>
        <Typography variant="body2"> Already have an account? </Typography>

        <Link href={paths.auth.login} component={RouterLink} variant="subtitle2">
          Sign in
        </Link>
      </Stack>
    </Stack>
  );

  const renderTerms = (
    <Typography
      component="div"
      sx={{
        color: "text.secondary",
        mt: 2.5,
        typography: "caption",
        textAlign: "center",
      }}
    >
      {"By signing up, I agree to "}
      <Link
        component={RouterLink}
        href={paths.legal.termOfService}
        underline="always"
        color="text.primary"
      >
        Terms of Service
      </Link>
      {" and "}
      <Link
        component={RouterLink}
        href={paths.legal.privacyPolicy}
        underline="always"
        color="text.primary"
      >
        Privacy Policy
      </Link>
      .
    </Typography>
  );

  const renderForm = (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Stack spacing={2.5}>
        {!!errorMsg && <Alert severity="error">{errorMsg}</Alert>}

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <RHFTextField name="name" label="Name" />
        </Stack>

        <RHFTextField name="email" label="Email address" />

        <Stack>
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
          {getValues("password") && (
            <PasswordStrengthBar
              minLength={8}
              password={getValues("password")}
              scoreWords={["Weak", "Weak", "Okay", "Good", "Strong"]}
            />
          )}
        </Stack>

        <LoadingButton
          fullWidth
          color="inherit"
          size="large"
          type="submit"
          variant="contained"
          loading={registerLoading}
        >
          Create account
        </LoadingButton>
      </Stack>
    </FormProvider>
  );

  return (
    <>
      {renderHead}

      {renderForm}

      {renderTerms}
    </>
  );
}
