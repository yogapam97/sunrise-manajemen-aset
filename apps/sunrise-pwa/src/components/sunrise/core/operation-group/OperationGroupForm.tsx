import type { IOperationGroupItem, IOperationGroupPayload } from "src/types/operation-group";

import _ from "lodash";
import * as Yup from "yup";
import { useSnackbar } from "notistack";
import { useForm } from "react-hook-form";
import { useMemo, useEffect } from "react";
import { yupResolver } from "@hookform/resolvers/yup";

import { LoadingButton } from "@mui/lab";
import { Card, Stack, Switch, FormGroup, Typography, FormControlLabel } from "@mui/material";

import { RHFTextField } from "src/components/hook-form";
import FormProvider from "src/components/hook-form/form-provider";

type OperationGroupFormProps = {
  workspaceId: string;
  defaultOperationGroup?: IOperationGroupItem;
  onSubmit: (operationGroup: IOperationGroupPayload) => void;
  isLoading?: boolean;
  submitErrors?: any[];
};

const OperationGroupSchema: Yup.ObjectSchema<any> = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  code: Yup.string()
    .nullable()
    .max(60, "Code cannot be longer than 60 characters")
    .matches(/^[^\s]*$/, { message: "Code must not contain spaces" }),
  description: Yup.string().nullable(),
});

export default function OperationGroupForm({
  workspaceId,
  onSubmit,
  defaultOperationGroup,
  isLoading,
  submitErrors,
}: OperationGroupFormProps) {
  const defaultValues: any = useMemo(
    () => ({
      name: defaultOperationGroup?.name || "",
      is_audit: defaultOperationGroup?.is_audit || false,
      is_assignment: defaultOperationGroup?.is_assignment || false,
      is_relocation: defaultOperationGroup?.is_relocation || false,
      is_transition: defaultOperationGroup?.is_transition || false,
      description: defaultOperationGroup?.description || "",
    }),
    [defaultOperationGroup]
  );

  const { enqueueSnackbar } = useSnackbar();

  const methods = useForm({
    resolver: yupResolver(OperationGroupSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    setError,
    setValue,
    getValues,
    formState: { errors },
    watch,
  } = methods;

  watch();

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

  const handleInputSubmit = handleSubmit(async (values: IOperationGroupPayload) =>
    onSubmit(values)
  );

  return (
    <Card sx={{ p: 2 }}>
      <FormProvider methods={methods} onSubmit={handleInputSubmit}>
        <Stack spacing={2}>
          <Stack spacing={2}>
            <Typography variant="subtitle2">Name</Typography>
            <RHFTextField
              name="name"
              error={!!errors.name}
              helperText={errors.name?.message as string}
              fullWidth
              variant="outlined"
              placeholder="Enter operation group name ..."
            />
          </Stack>

          <Stack spacing={2}>
            <Typography variant="subtitle2">Operation Group Task</Typography>
            <FormGroup>
              <FormControlLabel
                control={<Switch checked={getValues("is_audit")} />}
                label="Audit"
                onChange={(e: any) => setValue("is_audit", e.target.checked)}
              />
              <FormControlLabel
                control={<Switch checked={getValues("is_assignment")} />}
                label="Assignment"
                onChange={(e: any) => setValue("is_assignment", e.target.checked)}
              />
              <FormControlLabel
                control={<Switch checked={getValues("is_relocation")} />}
                label="Relocation"
                onChange={(e: any) => setValue("is_relocation", e.target.checked)}
              />
              <FormControlLabel
                control={<Switch checked={getValues("is_transition")} />}
                label="Transition"
                onChange={(e: any) => setValue("is_transition", e.target.checked)}
              />
            </FormGroup>
          </Stack>

          <Stack spacing={2}>
            <Typography variant="subtitle2">Description</Typography>
            <RHFTextField
              name="description"
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              placeholder="Enter operation group description ..."
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
              Save Operation Group
            </LoadingButton>
          </Stack>
        </Stack>
      </FormProvider>
    </Card>
  );
}
