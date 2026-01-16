import _ from "lodash";
import * as Yup from "yup";
import { useSnackbar } from "notistack";
import { useForm } from "react-hook-form";
import { useMemo, useState, useEffect } from "react";
import { yupResolver } from "@hookform/resolvers/yup";

import { LoadingButton } from "@mui/lab";
import { Card, Chip, Stack, Divider, Typography } from "@mui/material";

import Iconify from "src/components/iconify";
import { RHFTextField } from "src/components/hook-form";
import FormProvider from "src/components/hook-form/form-provider";

import AuditInputValue from "../audit/AuditInputValue";
import MemberInputAutocomplete from "../member/MemberInputAutocomplete";
import MetricInputAutocomplete from "../metric/MetricInputAutocomplete";
import LocationInputAutocomplete from "../location/LocationInputAutocomplete";
import LifecycleInputAutocomplete from "../lifecycle/LIfecycleInputAutocomplete";
import FixedAssetInputAutocomplete from "../fixed-asset/FixedAssetInputAutocomplete";
import { AUDIT_ICON, ASSIGNMENT_ICON, RELOCATION_ICON, TRANSITION_ICON } from "../icon-definitions";

type OperationGroupDoFormProps = {
  workspaceId: string;
  operationGroup: any;
  defaultOperationGroupDo?: any;
  onSubmit: (transition: any) => void;
  isLoading?: boolean;
  submitErrors?: any[];
};

const valueObjectSchema = Yup.object({
  label: Yup.string().required(),
  color: Yup.mixed().required(),
});

export default function OperationGroupDoForm({
  workspaceId,
  operationGroup,
  onSubmit,
  defaultOperationGroupDo,
  isLoading,
  submitErrors,
}: OperationGroupDoFormProps) {
  const [selectedMetric, setSelectedMetric] = useState<any>(null);
  const { is_audit, is_assignment, is_relocation, is_transition } = operationGroup;
  const OperationGroupDoSchema: Yup.ObjectSchema<any> = Yup.object().shape({
    fixed_asset: Yup.string().required("Fixed asset is required"),
    metric: is_audit ? Yup.string().required("Metric is required") : Yup.string().nullable(),
    value: is_audit
      ? Yup.mixed()
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
          })
      : Yup.mixed().nullable(),
    new_assignee: is_assignment
      ? Yup.string().required("New assignee is required")
      : Yup.string().nullable(),
    new_location: is_relocation
      ? Yup.string().required("New location is required")
      : Yup.string().nullable(),
    new_lifecycle: is_transition
      ? Yup.string().required("New lifecycle is required")
      : Yup.string().nullable(),
    note: Yup.string().nullable(),
  });

  const defaultValues: any = useMemo(
    () => ({
      fixed_asset: "",
      metric: "",
      value: "",
      new_assignee: "",
      new_location: "",
      new_lifecycle: "",
      note: "",
    }),
    []
  );

  const { enqueueSnackbar } = useSnackbar();

  const methods = useForm({
    resolver: yupResolver(OperationGroupDoSchema),
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

  const handleChangeFixedAsset = (event: any, value: any) => {
    setValue("fixed_asset", value?.id);
  };

  const handleChangeAssignee = (event: any, value: any) => {
    setValue("new_assignee", value?.id);
  };

  const handleChangeLocation = (event: any, value: any) => {
    setValue("new_location", value?.id);
  };

  const handleChangeLifecycle = (event: any, value: any) => {
    setValue("new_lifecycle", value?.id);
  };

  const handleChangeMetric = (event: any, value: any) => {
    setSelectedMetric(value);
    setValue("value", "");
    setValue("metric", value?.id);
  };

  const handleChangeValue = (e: any, value: any) => {
    if (selectedMetric?.type === "categorical") {
      setValue("value", value);
    } else {
      setValue("value", parseFloat(value));
    }
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

  const handleInputSubmit = handleSubmit(async (values: any) => onSubmit(values));

  return (
    <Card sx={{ p: 2 }}>
      <FormProvider methods={methods} onSubmit={handleInputSubmit}>
        <Stack spacing={2}>
          <Stack spacing={2}>
            <Typography variant="subtitle2">Fixed Asset</Typography>
            <FixedAssetInputAutocomplete
              workspaceId={workspaceId}
              onChange={handleChangeFixedAsset}
              error={!!errors.fixed_asset}
              helperText={errors.fixed_asset?.message as string}
            />
          </Stack>

          {is_audit && (
            <Stack spacing={1}>
              <Divider>
                <Chip
                  variant="outlined"
                  label="Audit"
                  size="small"
                  icon={<Iconify icon={AUDIT_ICON} />}
                />
              </Divider>
              <Typography variant="subtitle2">Metric</Typography>
              <MetricInputAutocomplete
                error={!!errors.metric}
                helperText={errors.metric?.message as string}
                workspaceId={workspaceId}
                onChange={handleChangeMetric}
              />
              {selectedMetric && (
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
            </Stack>
          )}

          {is_assignment && (
            <Stack spacing={2}>
              <Divider>
                <Chip
                  variant="outlined"
                  label="Assignment"
                  size="small"
                  icon={<Iconify icon={ASSIGNMENT_ICON} />}
                />
              </Divider>
              <Typography variant="subtitle2">New Assignee</Typography>
              <MemberInputAutocomplete
                error={!!errors.new_assignee}
                helperText={errors.new_assignee?.message as string}
                workspaceId={workspaceId}
                onChange={handleChangeAssignee}
              />
            </Stack>
          )}

          {is_relocation && (
            <Stack spacing={2}>
              <Divider>
                <Chip
                  variant="outlined"
                  label="Relocation"
                  size="small"
                  icon={<Iconify icon={RELOCATION_ICON} />}
                />
              </Divider>
              <Typography variant="subtitle2">New Location</Typography>
              <LocationInputAutocomplete
                error={!!errors.new_location}
                helperText={errors.new_location?.message as string}
                workspaceId={workspaceId}
                onChange={handleChangeLocation}
              />
            </Stack>
          )}

          {is_transition && (
            <Stack spacing={2}>
              <Divider>
                <Chip
                  variant="outlined"
                  label="Transition"
                  size="small"
                  icon={<Iconify icon={TRANSITION_ICON} />}
                />
              </Divider>
              <Typography variant="subtitle2">New Lifecycle</Typography>
              <LifecycleInputAutocomplete
                error={!!errors.new_lifecycle}
                helperText={errors.new_lifecycle?.message as string}
                workspaceId={workspaceId}
                onChange={handleChangeLifecycle}
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
              placeholder="Enter note ..."
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
              Save
            </LoadingButton>
          </Stack>
        </Stack>
      </FormProvider>
    </Card>
  );
}
