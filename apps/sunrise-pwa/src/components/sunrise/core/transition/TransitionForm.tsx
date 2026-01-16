import type { IFixedAssetItem } from "src/types/fixed-asset";
import type { ITransitionItem, ITransitionPayload } from "src/types/transition";

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

import TransitionFormDetail from "./TransitionFormDetail";
import LifecycleInputAutocomplete from "../lifecycle/LIfecycleInputAutocomplete";
import FixedAssetInputAutocomplete from "../fixed-asset/FixedAssetInputAutocomplete";

type TransitionFormProps = {
  workspaceId: string;
  defaultTransition?: ITransitionItem;
  onSubmit: (transition: ITransitionPayload) => void;
  isLoading?: boolean;
  submitErrors?: any[];
};

const TransitionSchema: Yup.ObjectSchema<any> = Yup.object().shape({
  fixed_asset: Yup.string().required("Fixed asset is required"),
  new_lifecycle: Yup.string().required("New lifecycle is required"),
  note: Yup.string().nullable(),
});

export default function TransitionForm({
  workspaceId,
  onSubmit,
  defaultTransition,
  isLoading,
  submitErrors,
}: TransitionFormProps) {
  const [selectedFixedAsset, setSelectedFixedAsset] = useState<IFixedAssetItem | null>(
    defaultTransition?.fixed_asset || null
  );
  const defaultValues: any = useMemo(
    () => ({
      fixed_asset: defaultTransition?.fixed_asset?.id || null,
      new_lifecycle: "",
      note: "",
    }),
    [defaultTransition]
  );

  const { enqueueSnackbar } = useSnackbar();

  const methods = useForm({
    resolver: yupResolver(TransitionSchema),
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

  const handleChangeLifecycle = (event: any, value: any) => {
    setValue("new_lifecycle", value?.id);
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

  const handleInputSubmit = handleSubmit(async (values: ITransitionPayload) => onSubmit(values));

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
                <Typography variant="subtitle2">New Lifecycle</Typography>
                <LifecycleInputAutocomplete
                  maintenanceCycle={false}
                  error={!!errors.new_lifecycle}
                  helperText={errors.new_lifecycle?.message as string}
                  workspaceId={workspaceId}
                  onChange={handleChangeLifecycle}
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
                  placeholder="Enter transition note ..."
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
                  Save Transition
                </LoadingButton>
              </Stack>
            </Stack>
          </FormProvider>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <TransitionFormDetail workspaceId={workspaceId} fixedAsset={selectedFixedAsset} />
      </Grid>
    </Grid>
  );
}
