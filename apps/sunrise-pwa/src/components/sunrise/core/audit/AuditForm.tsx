import type { IFixedAssetItem } from "src/types/fixed-asset";
import type { IAuditItem, IAuditPayload } from "src/types/audit";

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

import AuditInputValue from "./AuditInputValue";
import AuditFormDetail from "./AuditFormDetail";
import MetricInputAutocomplete from "../metric/MetricInputAutocomplete";
import FixedAssetInputAutocomplete from "../fixed-asset/FixedAssetInputAutocomplete";

type AuditFormProps = {
  workspaceId: string;
  defaultAudit?: IAuditItem;
  onSubmit: (audit: IAuditPayload) => void;
  isLoading?: boolean;
  submitErrors?: any[];
};
// Define a schema for the object format
const valueObjectSchema = Yup.object({
  label: Yup.string().required(),
  color: Yup.mixed().required(),
});

const AuditSchema = Yup.object().shape({
  fixed_asset: Yup.string().required("Fixed asset is required"),
  metric: Yup.string().required("Metric is required"),
  value: Yup.mixed()
    .required("Value is required")
    .test("is-valid-value", "Value is required", (value) => {
      // Check if the value is an empty string
      if (value === "") {
        return false;
      }
      // Check if the value is a number
      if (typeof value === "number") {
        return true;
      }
      // Check if the value is an object matching the schema
      if (typeof value === "object") {
        return valueObjectSchema.isValidSync(value);
      }
      // Invalid if it's neither a number nor a valid object
      return false;
    }),
  note: Yup.string().nullable(),
});

export default function AuditForm({
  workspaceId,
  onSubmit,
  defaultAudit,
  isLoading,
  submitErrors,
}: AuditFormProps) {
  const [selectedFixedAsset, setSelectedFixedAsset] = useState<IFixedAssetItem | null>(
    defaultAudit?.fixed_asset || null
  );
  const [selectedMetric, setSelectedMetric] = useState<any>(null);
  const defaultValues: any = useMemo(
    () => ({
      fixed_asset: defaultAudit?.fixed_asset?.id || null,
      metric: "",
      note: "",
    }),
    [defaultAudit]
  );

  const { enqueueSnackbar } = useSnackbar();

  const methods = useForm({
    resolver: yupResolver(AuditSchema),
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

  const handleChangeValue = (e: any, value: any) => {
    if (selectedMetric?.type === "categorical") {
      setValue("value", value);
    } else {
      setValue("value", parseFloat(value));
    }
  };

  const handleChangeFixedAsset = (event: any, value: any) => {
    setSelectedFixedAsset(value);
    setValue("fixed_asset", value?.id);
  };

  const handleChangeMetric = (event: any, value: any) => {
    setSelectedMetric(value);
    setValue("value", "");
    setValue("metric", value?.id);
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

  const handleInputSubmit = handleSubmit(async (values: IAuditPayload) => onSubmit(values));

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
                <Typography variant="subtitle2">Metric</Typography>
                <MetricInputAutocomplete
                  error={!!errors.metric}
                  helperText={errors.metric?.message as string}
                  workspaceId={workspaceId}
                  onChange={handleChangeMetric}
                />
              </Stack>

              {getValues("metric") && (
                <Stack spacing={2}>
                  <Typography variant="subtitle2">Value</Typography>
                  <AuditInputValue
                    onChange={handleChangeValue}
                    metric={selectedMetric}
                    value={getValues("value")}
                    error={!!errors.value}
                    helperText={errors.value?.message as string}
                  />
                </Stack>
              )}

              <Stack spacing={2}>
                <Typography variant="subtitle2">Note</Typography>
                <RHFTextField
                  name="note"
                  fullWidth
                  multiline
                  rows={4}
                  variant="outlined"
                  placeholder="Enter audit note ..."
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
                  Save Audit
                </LoadingButton>
              </Stack>
            </Stack>
          </FormProvider>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <AuditFormDetail workspaceId={workspaceId} fixedAsset={selectedFixedAsset} />
      </Grid>
    </Grid>
  );
}
