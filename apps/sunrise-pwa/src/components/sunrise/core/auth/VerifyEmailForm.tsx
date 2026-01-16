"use client";

import { useEffect } from "react";
import { first, isEmpty } from "lodash";
import { useSnackbar } from "notistack";

import Stack from "@mui/material/Stack";
import { Box, Button } from "@mui/material";
import Typography from "@mui/material/Typography";
import LoadingButton from "@mui/lab/LoadingButton";

import { RouterLink } from "src/routes/components";

import Iconify from "src/components/iconify";

// ----------------------------------------------------------------------

type VerifyEmailFormProps = {
  onSubmit: (data: any) => void;
  submitErrors?: any[];
  loading?: boolean;
  success?: boolean;
};

export default function VerifyEmailForm({
  onSubmit,
  submitErrors,
  loading,
  success,
}: VerifyEmailFormProps) {
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (!isEmpty(submitErrors)) {
      enqueueSnackbar(first(submitErrors)?.message || "Failed To Verify Email", {
        variant: "error",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "center",
        },
      });
    }
  }, [submitErrors, enqueueSnackbar]);

  const renderForm = (
    <Stack spacing={3} alignItems="center">
      {!success ? (
        <Stack spacing={3} alignItems="center" sx={{ width: "100%" }}>
          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            loading={loading}
            onClick={onSubmit}
            color="info"
            endIcon={<Iconify icon="eva:arrow-ios-forward-fill" />}
            sx={{ justifyContent: "space-between", pl: 2, pr: 1.5 }}
          >
            Verify My Email
          </LoadingButton>
        </Stack>
      ) : (
        <Box alignItems="center" sx={{ width: "100%" }}>
          <Iconify icon="ph:seal-check-fill" color="info.main" />
          <Typography variant="subtitle1">Email Verified</Typography>
          <Button
            sx={{ mt: 2 }}
            fullWidth
            size="small"
            variant="outlined"
            color="info"
            LinkComponent={RouterLink}
            href="/"
          >
            Home
          </Button>
        </Box>
      )}
    </Stack>
  );

  const renderHead = (
    <>
      <Iconify icon="solar:check-circle-bold" sx={{ height: 96, width: 96 }} />

      <Stack spacing={1} sx={{ mt: 3, mb: 5 }}>
        <Typography variant="h3">Verify Your Email</Typography>

        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          Click the button below to verify your email
        </Typography>
      </Stack>
    </>
  );

  return (
    <Box>
      {renderHead}

      {renderForm}
    </Box>
  );
}
