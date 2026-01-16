import type { IFixedAssetItem } from "src/types/fixed-asset";
import type { IRelocationItem, IRelocationPayload } from "src/types/relocation";

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

import RelocationFormDetail from "./RelocationFormDetail";
import LocationInputAutocomplete from "../location/LocationInputAutocomplete";
import FixedAssetInputAutocomplete from "../fixed-asset/FixedAssetInputAutocomplete";

type RelocationFormProps = {
  workspaceId: string;
  defaultRelocation?: IRelocationItem;
  onSubmit: (relocation: IRelocationPayload) => void;
  isLoading?: boolean;
  submitErrors?: any[];
};

const RelocationSchema: Yup.ObjectSchema<any> = Yup.object().shape({
  fixed_asset: Yup.string().required("Fixed asset is required"),
  new_location: Yup.string().required("New location is required"),
  note: Yup.string().nullable(),
});

export default function RelocationForm({
  workspaceId,
  onSubmit,
  defaultRelocation,
  isLoading,
  submitErrors,
}: RelocationFormProps) {
  const [selectedFixedAsset, setSelectedFixedAsset] = useState<IFixedAssetItem | null>(
    defaultRelocation?.fixed_asset || null
  );
  const defaultValues: any = useMemo(
    () => ({
      fixed_asset: defaultRelocation?.fixed_asset?.id || null,
      new_location: "",
      note: "",
    }),
    [defaultRelocation]
  );

  const { enqueueSnackbar } = useSnackbar();

  const methods = useForm({
    resolver: yupResolver(RelocationSchema),
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

  const handleChangeLocation = (event: any, value: any) => {
    setValue("new_location", value?.id);
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

  const handleInputSubmit = handleSubmit(async (values: IRelocationPayload) => onSubmit(values));

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
                <Typography variant="subtitle2">New Location</Typography>
                <LocationInputAutocomplete
                  error={!!errors.new_location}
                  helperText={errors.new_location?.message as string}
                  workspaceId={workspaceId}
                  onChange={handleChangeLocation}
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
                  placeholder="Enter relocation note ..."
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
                  Save Relocation
                </LoadingButton>
              </Stack>
            </Stack>
          </FormProvider>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <RelocationFormDetail workspaceId={workspaceId} fixedAsset={selectedFixedAsset} />
      </Grid>
    </Grid>
  );
}
