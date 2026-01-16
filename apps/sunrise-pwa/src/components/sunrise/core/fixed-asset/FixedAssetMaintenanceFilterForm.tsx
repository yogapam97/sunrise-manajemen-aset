import * as Yup from "yup";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { DatePicker } from "@mui/x-date-pickers";
import { Card, Stack, Button, Typography, ButtonGroup } from "@mui/material";

import Iconify from "src/components/iconify";
import FormProvider from "src/components/hook-form/form-provider";

import { useWorkspaceContext } from "src/auth/hooks";

import MemberInputAutocomplete from "../member/MemberInputAutocomplete";
import LocationInputAutocomplete from "../location/LocationInputAutocomplete";
import {
  CHECK_ICON,
  CHECK_IN_ICON,
  CHECK_OUT_ICON,
  ASSIGNMENT_ICON,
  RELOCATION_ICON,
} from "../icon-definitions";

type FixedAssetMaintenanceFilterFormProps = {
  defaultFilter?: any;
  onFilter: (values: any) => void;
  config?: any;
};

const FixedAssetMaintenanceFilterSchema: Yup.ObjectSchema<any> = Yup.object().shape({
  status: Yup.array().nullable(),
  location: Yup.array().nullable(),
  assignee: Yup.array().nullable(),
  start_date: Yup.date().nullable(),
  end_date: Yup.date().nullable(),
});

export default function FixedAssetMaintenanceFilterForm({
  defaultFilter,
  onFilter,
  config,
}: FixedAssetMaintenanceFilterFormProps) {
  const { workspace } = useWorkspaceContext();

  const defaultValues: any = useMemo(
    () => ({
      status: defaultFilter?.status || ["maintenance-in", "maintenance-out"],
      location: defaultFilter?.location || [],
      assignee: defaultFilter?.assignee || [],
      start_date: defaultFilter?.start_date || null,
      end_date: defaultFilter?.end_date || null,
    }),
    [defaultFilter]
  );

  const methods = useForm({
    resolver: yupResolver(FixedAssetMaintenanceFilterSchema),
    defaultValues,
  });

  const { handleSubmit, setValue, getValues, watch, reset } = methods;
  watch();

  const handleFixedAssetMaintenanceFilter = (status: string) => {
    const statusValue = getValues("status");
    if (statusValue.includes(status)) {
      setValue(
        "status",
        statusValue.filter((value: string) => value !== status)
      );
    } else {
      setValue("status", [...statusValue, status]);
    }
  };

  const handleInputSubmit = handleSubmit(async (inputValues: any) => {
    onFilter(inputValues);
  });

  const handleReset = () => {
    reset();
    setValue("status", ["maintenance-in", "maintenance-out"]);
    setValue("assignee", []);
    setValue("location", []);
    setValue("start_date", null);
    setValue("end_date", null);
  };

  return (
    <Card sx={{ px: 2, pb: 2 }}>
      <FormProvider methods={methods} onSubmit={handleInputSubmit}>
        <Stack spacing={1}>
          <Stack spacing={1} direction="row" alignItems="center">
            <Iconify icon={CHECK_ICON} />
            <Typography variant="subtitle2">Status</Typography>
          </Stack>
          <Stack spacing={1} direction="row" alignItems="center">
            <ButtonGroup size="small">
              <Button
                variant={getValues("status").includes("maintenance-in") ? "contained" : "outlined"}
                startIcon={<Iconify icon={CHECK_IN_ICON} />}
                onClick={() => handleFixedAssetMaintenanceFilter("maintenance-in")}
              >
                Maintenance In
              </Button>
              <Button
                variant={getValues("status").includes("maintenance-out") ? "contained" : "outlined"}
                startIcon={<Iconify icon={CHECK_OUT_ICON} />}
                onClick={() => handleFixedAssetMaintenanceFilter("maintenance-out")}
              >
                Maintenance Out
              </Button>
            </ButtonGroup>
          </Stack>
          <Stack spacing={1} direction="row" alignItems="center">
            <Iconify icon={ASSIGNMENT_ICON} />
            <Typography variant="subtitle2">Member</Typography>
          </Stack>
          <Stack spacing={1}>
            <MemberInputAutocomplete
              multiple
              size="small"
              workspaceId={workspace?.id as string}
              defaultValue={getValues("assignee")}
              onChange={(e: any, value: any) => setValue("assignee", value)}
              hideInvite
            />
          </Stack>
          <Stack spacing={1} direction="row" alignItems="center">
            <Iconify icon={RELOCATION_ICON} />
            <Typography variant="subtitle2">Location</Typography>
          </Stack>
          <Stack spacing={1}>
            <LocationInputAutocomplete
              multiple
              size="small"
              workspaceId={workspace?.id as string}
              defaultValue={getValues("location")}
              onChange={(e: any, value: any) => setValue("location", value)}
              hideCreateNew
            />
          </Stack>
          <Stack spacing={1} direction="row" alignItems="center">
            <Iconify icon="solar:calendar-search-outline" />
            <Typography variant="subtitle2">Expire Date Range</Typography>
          </Stack>
          <Stack spacing={1} direction="row" alignItems="center">
            <DatePicker
              format="dd/MM/yyyy"
              onChange={(date) => {
                setValue("end_date", null);
                setValue("start_date", date);
              }}
              value={getValues("start_date")}
              slotProps={{
                textField: {
                  fullWidth: true,
                  size: "small",
                  placeholder: "Start Date ...",
                },
              }}
            />
            <Iconify sx={{ width: 50, height: 50 }} icon="lucide:calendar-range" />
            <DatePicker
              format="dd/MM/yyyy"
              onChange={(date) => {
                setValue("end_date", date);
              }}
              value={getValues("end_date")}
              minDate={getValues("start_date")}
              disabled={!getValues("start_date")}
              slotProps={{
                textField: {
                  fullWidth: true,
                  size: "small",
                  placeholder: "End Date ...",
                },
              }}
            />
          </Stack>
          <Stack direction="row" spacing={1} justifyContent="end">
            <Button onClick={handleReset} variant="outlined">
              Reset
            </Button>
            <Button type="submit" variant="contained">
              Filter
            </Button>
          </Stack>
        </Stack>
      </FormProvider>
    </Card>
  );
}
