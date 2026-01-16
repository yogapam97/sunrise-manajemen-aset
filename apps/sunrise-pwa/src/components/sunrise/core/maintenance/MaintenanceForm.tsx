import type { IFixedAssetItem } from "src/types/fixed-asset";
import type { IMaintenanceItem, IMaintenancePayload } from "src/types/maintenance";

import _ from "lodash";
import * as Yup from "yup";
import { useSnackbar } from "notistack";
import { useForm } from "react-hook-form";
import { useMemo, useState, useEffect } from "react";
import { yupResolver } from "@hookform/resolvers/yup";

import { LoadingButton } from "@mui/lab";
import { DatePicker } from "@mui/x-date-pickers";
import {
  Card,
  Grid,
  Stack,
  Switch,
  Typography,
  ListItemText,
  FormControlLabel,
} from "@mui/material";

import { useBoolean } from "src/hooks/use-boolean";

import { RHFTextField } from "src/components/hook-form";
import FormProvider from "src/components/hook-form/form-provider";

import CurrencyDisplay from "../../common/CurrencyDisplay";
import MaintenanceFormDetail from "./MaintenanceFormDetail";
import LifecycleInputAutocomplete from "../lifecycle/LIfecycleInputAutocomplete";
import FixedAssetInputAutocomplete from "../fixed-asset/FixedAssetInputAutocomplete";

type MaintenanceFormProps = {
  workspaceId: string;
  defaultMaintenance?: IMaintenanceItem;
  onSubmit: (maintenance: IMaintenancePayload) => void;
  isLoading?: boolean;
  submitErrors?: any[];
};

const TransitionOption = () => (
  <ListItemText primary="Perform Transition" secondary="Set as under maintenance" />
);

export default function MaintenanceForm({
  workspaceId,
  onSubmit,
  defaultMaintenance,
  isLoading,
  submitErrors,
}: MaintenanceFormProps) {
  const [selectedFixedAsset, setSelectedFixedAsset] = useState<IFixedAssetItem | null>(
    defaultMaintenance?.fixed_asset || null
  );
  const isTransition = useBoolean();

  const MaintenanceSchema: Yup.ObjectSchema<any> = Yup.object().shape({
    fixed_asset: Yup.string().required("Fixed asset is required"),
    is_transition: Yup.boolean().nullable(),
    lifecycle: isTransition.value
      ? Yup.string().required("Maintenance lifecycle is required")
      : Yup.string().nullable(),
    maintenance_cost: Yup.number().required("Maintenance cost is required"),
    maintenance_date: Yup.date().required("Maintenance date is required"),
    maintenance_next_date: Yup.date().nullable(),
    note: Yup.string().nullable(),
  });

  const defaultValues: any = useMemo(
    () => ({
      fixed_asset: defaultMaintenance?.fixed_asset?.id || null,
      is_transition: defaultMaintenance?.is_transition || false,
      lifecycle: "",
      maintenance_cost: defaultMaintenance?.maintenance_cost || 0,
      maintenance_date: new Date(),
      maintenance_next_date: null,
      note: "",
    }),
    [defaultMaintenance]
  );

  const { enqueueSnackbar } = useSnackbar();

  const methods = useForm({
    resolver: yupResolver(MaintenanceSchema),
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
    setSelectedFixedAsset(value);
    setValue("fixed_asset", value?.id);
  };

  const handleLifecycleChange = (event: any, value: any) => {
    setValue("lifecycle", value?.id);
  };

  const handleChangeTransition = (e: any) => {
    isTransition.onToggle();
    setValue("is_transition", e.target.checked);
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

  const handleInputSubmit = handleSubmit(async (values: IMaintenancePayload) => onSubmit(values));

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

              <Stack spacing={1.5}>
                <Typography variant="subtitle2">Maintenance Cost</Typography>
                <RHFTextField
                  name="maintenance_cost"
                  error={!!errors.maintenance_cost}
                  helperText={errors.maintenance_cost?.message as string}
                  fullWidth
                  variant="outlined"
                  placeholder="0.0"
                />
                <CurrencyDisplay variant="caption" value={Number(getValues("maintenance_cost"))} />
              </Stack>

              <Card sx={{ p: 2 }}>
                <Stack spacing={2}>
                  <FormControlLabel
                    control={<Switch onChange={handleChangeTransition} />}
                    label={<TransitionOption />}
                  />
                </Stack>
                {getValues("is_transition") && (
                  <Stack spacing={2}>
                    <Typography variant="subtitle2">Transition</Typography>
                    <LifecycleInputAutocomplete
                      maintenanceCycle
                      error={!!errors.lifecycle}
                      helperText={errors.lifecycle?.message as string}
                      workspaceId={workspaceId}
                      onChange={handleLifecycleChange}
                    />
                  </Stack>
                )}
              </Card>

              <Stack spacing={1}>
                <Typography variant="subtitle2">Maintenance Date</Typography>
                <DatePicker
                  format="dd/MM/yyyy"
                  onChange={(date) => {
                    setValue("maintenance_date", date);
                  }}
                  maxDate={new Date()}
                  value={getValues("maintenance_date")}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      placeholder: "Select maintenance date ...",
                    },
                  }}
                />
              </Stack>

              <Stack spacing={1}>
                <Typography variant="subtitle2">Next Maintenance Date</Typography>
                <DatePicker
                  format="dd/MM/yyyy"
                  onChange={(date) => {
                    setValue("maintenance_next_date", date);
                  }}
                  minDate={new Date()}
                  value={getValues("maintenance_next_date")}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      placeholder: "Select next maintenance date ...",
                    },
                  }}
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
                  placeholder="Enter maintenance note ..."
                />
              </Stack>

              <Stack spacing={2}>
                <LoadingButton
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  disabled={!selectedFixedAsset}
                  loading={isLoading}
                >
                  Save Maintenance
                </LoadingButton>
              </Stack>
            </Stack>
          </FormProvider>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <MaintenanceFormDetail workspaceId={workspaceId} fixedAsset={selectedFixedAsset} />
      </Grid>
    </Grid>
  );
}
