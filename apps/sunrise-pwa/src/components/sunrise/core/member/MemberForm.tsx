import type { IMemberPayload } from "src/types/member";

import * as Yup from "yup";
import { isEmpty } from "lodash";
import { useSnackbar } from "notistack";
import { useMemo, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { LoadingButton } from "@mui/lab";
import { Box, Card, Chip, Paper, Stack, ButtonBase, Typography } from "@mui/material";

import { stopPropagate } from "src/utils/stopPropagate";

import Iconify from "src/components/iconify";
import { RHFTextField } from "src/components/hook-form";
import FormProvider from "src/components/hook-form/form-provider";

import { MEMBER_USER_ICON, MEMBER_ADMIN_ICON } from "../icon-definitions";

type MemberFormProps = {
  onSubmit: (member: IMemberPayload) => void;
  loading?: boolean;
  submitErrors?: any[];
  defaultMember?: any;
};

const MemberSchema: Yup.ObjectSchema<IMemberPayload> = Yup.object().shape({
  email: Yup.string().email("Email not valid").required("Email is required"),
  code: Yup.string()
    .nullable()
    .max(60, "Code cannot be longer than 60 characters")
    .matches(/^[^\s]*$/, { message: "Code must not contain spaces" }),
  role: Yup.string().oneOf(["admin", "user"]).required("Role is required"),
});

export default function MemberForm({
  onSubmit,
  loading,
  submitErrors,
  defaultMember,
}: MemberFormProps) {
  const { enqueueSnackbar } = useSnackbar();
  const defaultValues: IMemberPayload = useMemo(
    () => ({
      email: defaultMember?.email || "",
      code: defaultMember?.code || "",
      role: defaultMember?.role || "admin",
    }),
    [defaultMember]
  );

  const methods = useForm({
    resolver: yupResolver(MemberSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
    setError,
    watch,
  } = methods;

  watch();

  const handleInputSubmit = handleSubmit(async (values: IMemberPayload) =>
    onSubmit(values as IMemberPayload)
  );

  useEffect(() => {
    if (!isEmpty(submitErrors)) {
      submitErrors?.forEach((error) => {
        setError(error.field, { message: error.message });
      });
    }

    if (!isEmpty(errors)) {
      enqueueSnackbar("Please check again your input", {
        variant: "error",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "center",
        },
      });
    }
  }, [setError, submitErrors, errors, enqueueSnackbar]);

  return (
    <Card sx={{ p: 2 }}>
      <FormProvider methods={methods} onSubmit={stopPropagate(handleInputSubmit) as VoidFunction}>
        <Stack spacing={2}>
          <Stack spacing={2}>
            <Typography variant="subtitle2">Email</Typography>
            <RHFTextField
              name="email"
              disabled={!!defaultMember?.email}
              error={!!errors.email}
              helperText={errors.email?.message}
              fullWidth
              variant="outlined"
              placeholder="Enter member email ..."
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
              placeholder="Enter member code ..."
            />
          </Stack>

          <Stack spacing={2}>
            <Typography variant="subtitle2">Role</Typography>
            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <Box gap={2} display="grid" gridTemplateColumns="repeat(2, 1fr)">
                  {[
                    {
                      label: "Admin",
                      value: "admin",
                      icon: <Iconify icon={MEMBER_ADMIN_ICON} width={32} sx={{ mb: 2 }} />,
                    },
                    {
                      label: "User",
                      value: "user",
                      disabled: true,
                      icon: <Iconify icon={MEMBER_USER_ICON} width={32} sx={{ mb: 2 }} />,
                      chip: <Chip disabled label="Coming soon" size="small" />,
                    },
                  ].map((item) => (
                    <Paper
                      component={ButtonBase}
                      variant="outlined"
                      disabled={item.disabled}
                      key={item.value}
                      onClick={() => field.onChange(item.value)}
                      sx={{
                        p: 2.5,
                        borderRadius: 1,
                        typography: "subtitle2",
                        flexDirection: "column",
                        ...(item.value === field.value && {
                          borderWidth: 2,
                          borderColor: "text.primary",
                        }),
                      }}
                    >
                      {item.icon}
                      {item.label}
                      {item.chip}
                    </Paper>
                  ))}
                </Box>
              )}
            />
          </Stack>
          <Stack spacing={2}>
            <LoadingButton type="submit" loading={loading} fullWidth variant="contained">
              {defaultMember?.id ? "Save" : "Invite"}
            </LoadingButton>
          </Stack>
        </Stack>
      </FormProvider>
    </Card>
  );
}
