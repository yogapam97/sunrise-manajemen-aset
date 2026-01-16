import type { IFixedAssetItem } from "src/types/fixed-asset";
import type { IAssignmentItem, IAssignmentPayload } from "src/types/assignment";

import _ from "lodash";
import * as Yup from "yup";
import { useSnackbar } from "notistack";
import { useForm } from "react-hook-form";
import { useMemo, useState, useEffect } from "react";
import { yupResolver } from "@hookform/resolvers/yup";

import { LoadingButton } from "@mui/lab";
import { Card, Grid, Stack, Typography } from "@mui/material";

import { RHFTextField } from "src/components/hook-form";
import FormProvider from "src/components/hook-form/form-provider";

import AssignmentFormDetail from "./AssignmentFormDetail";
import MemberInputAutocomplete from "../member/MemberInputAutocomplete";
import FixedAssetInputAutocomplete from "../fixed-asset/FixedAssetInputAutocomplete";

type AssignmentFormProps = {
  workspaceId: string;
  defaultAssignment?: IAssignmentItem;
  onSubmit: (assignment: IAssignmentPayload) => void;
  isLoading?: boolean;
  submitErrors?: any[];
};

const AssignmentSchema: Yup.ObjectSchema<any> = Yup.object().shape({
  fixed_asset: Yup.string().required("Fixed asset is required"),
  new_assignee: Yup.string().required("New assignee is required"),
  note: Yup.string().nullable(),
});

export default function AssignmentForm({
  workspaceId,
  onSubmit,
  defaultAssignment,
  isLoading,
  submitErrors,
}: AssignmentFormProps) {
  const [selectedFixedAsset, setSelectedFixedAsset] = useState<IFixedAssetItem | null>(
    defaultAssignment?.fixed_asset || null
  );

  const defaultValues: any = useMemo(
    () => ({
      fixed_asset: defaultAssignment?.fixed_asset?.id || null,
      new_assignee: "",
      note: "",
    }),
    [defaultAssignment]
  );

  const { enqueueSnackbar } = useSnackbar();

  const methods = useForm({
    resolver: yupResolver(AssignmentSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    setError,
    setValue,
    formState: { errors },
    watch,
  } = methods;

  watch();

  const handleChangeFixedAsset = (event: any, value: any) => {
    setSelectedFixedAsset(value);
    setValue("fixed_asset", value?.id);
  };

  const handleChangeAssignment = (event: any, value: any) => {
    setValue("new_assignee", value?.id);
  };

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

  const handleInputSubmit = handleSubmit(async (values: IAssignmentPayload) => onSubmit(values));

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <Card sx={{ p: 2 }}>
          <FormProvider methods={methods} onSubmit={handleInputSubmit}>
            <Stack spacing={2}>
              <Stack spacing={2}>
                <Typography variant="subtitle2">Fixed Asset</Typography>
                <FixedAssetInputAutocomplete
                  workspaceId={workspaceId}
                  defaultValue={selectedFixedAsset}
                  onChange={handleChangeFixedAsset}
                  error={!!errors.fixed_asset}
                  helperText={errors.fixed_asset?.message as string}
                />
              </Stack>

              <Stack spacing={2}>
                <Typography variant="subtitle2">New Assignment</Typography>
                <MemberInputAutocomplete
                  error={!!errors.new_assignee}
                  helperText={errors.new_assignee?.message as string}
                  workspaceId={workspaceId}
                  onChange={handleChangeAssignment}
                />
              </Stack>

              <Stack spacing={2}>
                <Typography variant="subtitle2">Note</Typography>
                <RHFTextField
                  name="note"
                  fullWidth
                  multiline
                  rows={4}
                  variant="outlined"
                  placeholder="Enter assignment note ..."
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
                  Save Assignment
                </LoadingButton>
              </Stack>
            </Stack>
          </FormProvider>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <AssignmentFormDetail workspaceId={workspaceId} fixedAsset={selectedFixedAsset} />
      </Grid>
    </Grid>
  );
}
