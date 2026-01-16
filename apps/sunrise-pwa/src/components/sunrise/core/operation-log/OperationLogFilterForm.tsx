import * as Yup from "yup";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { DatePicker } from "@mui/x-date-pickers";
import { Card, Stack, Button, Typography } from "@mui/material";

import Iconify from "src/components/iconify";
import FormProvider from "src/components/hook-form/form-provider";

import { useWorkspaceContext } from "src/auth/hooks";

import MemberInputAutocomplete from "../member/MemberInputAutocomplete";
import MetricInputAutocomplete from "../metric/MetricInputAutocomplete";
import LocationInputAutocomplete from "../location/LocationInputAutocomplete";
import LifecycleInputAutocomplete from "../lifecycle/LIfecycleInputAutocomplete";
import OperationTypeInputAutocomplete from "../operation-group/OperationTypeInputAutocomplete";
import OperationGroupInputAutocomplete from "../operation-group/OperationGroupInputAutocomplete";
import {
  AUDIT_ICON,
  ASSIGNMENT_ICON,
  RELOCATION_ICON,
  TRANSITION_ICON,
  OPERATION_GROUP_ICON,
} from "../icon-definitions";

type OperationLogFilterFormProps = {
  defaultFilter?: any;
  onFilter: (values: any) => void;
  config?: any;
};

const OperationLogFilterSchema: Yup.ObjectSchema<any> = Yup.object().shape({
  operation_group: Yup.array().nullable(),
  operation_type: Yup.array().nullable(),
  metric: Yup.array().nullable(),
  old_location: Yup.array().nullable(),
  new_location: Yup.array().nullable(),
  old_lifecycle: Yup.array().nullable(),
  new_lifecycle: Yup.array().nullable(),
  old_assignee: Yup.array().nullable(),
  new_assignee: Yup.array().nullable(),
  start_date: Yup.date().nullable(),
  end_date: Yup.date().nullable(),
});

export default function OperationLogFilterForm({
  defaultFilter,
  onFilter,
  config,
}: OperationLogFilterFormProps) {
  const { workspace } = useWorkspaceContext();

  const defaultValues: any = useMemo(
    () => ({
      operation_group: defaultFilter?.operation_group || [],
      operation_type: defaultFilter?.operation_type || [],
      metric: defaultFilter?.metric || [],
      old_location: defaultFilter?.old_location || [],
      new_location: defaultFilter?.new_location || [],
      old_lifecycle: defaultFilter?.old_lifecycle || [],
      new_lifecycle: defaultFilter?.new_lifecycle || [],
      old_assignee: defaultFilter?.old_assignee || [],
      new_assignee: defaultFilter?.new_assignee || [],
      start_date: defaultFilter?.start_date || null,
      end_date: defaultFilter?.end_date || null,
    }),
    [defaultFilter]
  );

  const methods = useForm({
    resolver: yupResolver(OperationLogFilterSchema),
    defaultValues,
  });

  const { handleSubmit, setValue, getValues, watch, reset } = methods;
  watch();

  const handleInputSubmit = handleSubmit(async (inputValues: any) => {
    onFilter(inputValues);
  });

  const handleOperationTypeChange = (e: any, value: any) => {
    setValue("operation_type", value);
  };

  const handleReset = () => {
    reset();
    setValue("operation_group", []);
    setValue("operation_type", []);
    setValue("metric", []);
    setValue("old_assignee", []);
    setValue("new_assignee", []);
    setValue("old_location", []);
    setValue("new_location", []);
    setValue("old_lifecycle", []);
    setValue("new_lifecycle", []);
    setValue("start_date", null);
    setValue("end_date", null);
  };

  return (
    <Card sx={{ px: 2, pb: 2 }}>
      <FormProvider methods={methods} onSubmit={handleInputSubmit}>
        <Stack spacing={1}>
          <Stack spacing={1} direction="row" alignItems="center">
            <Iconify icon={OPERATION_GROUP_ICON} />
            <Typography variant="subtitle2">Operation</Typography>
          </Stack>
          <Stack spacing={1} direction="row" alignItems="center">
            {config?.showFilterOperationGroup && (
              <OperationGroupInputAutocomplete
                multiple
                size="small"
                workspaceId={workspace?.id as string}
                defaultValue={getValues("operation_group")}
                onChange={(e: any, value: any) => setValue("operation_group", value)}
                placeholder="Select Operation Group ..."
              />
            )}
            {config?.showFilterOperationGroup && config?.showFilterOperationType && (
              <Iconify sx={{ width: 50, height: 50 }} icon={OPERATION_GROUP_ICON} />
            )}
            {config?.showFilterOperationType && (
              <OperationTypeInputAutocomplete
                multiple
                size="small"
                defaultValue={getValues("operation_type")}
                onChange={handleOperationTypeChange}
              />
            )}
          </Stack>
          {config?.showFilterAudit && (
            <>
              <Stack spacing={1} direction="row" alignItems="center">
                <Iconify icon={AUDIT_ICON} />
                <Typography variant="subtitle2">Audit</Typography>
              </Stack>
              <Stack spacing={1} direction="row" alignItems="center">
                <MetricInputAutocomplete
                  multiple
                  size="small"
                  workspaceId={workspace?.id as string}
                  defaultValue={getValues("metric")}
                  onChange={(e: any, value: any) => setValue("metric", value)}
                  placeholder="Select Audit Metric ..."
                  hideCreateNew
                />
              </Stack>
            </>
          )}
          {config?.showFilterAssignment && (
            <>
              <Stack spacing={1} direction="row" alignItems="center">
                <Iconify icon={ASSIGNMENT_ICON} />
                <Typography variant="subtitle2">Assignment</Typography>
              </Stack>
              <Stack spacing={1} direction="row" alignItems="center">
                <MemberInputAutocomplete
                  multiple
                  size="small"
                  workspaceId={workspace?.id as string}
                  defaultValue={getValues("old_assignee")}
                  onChange={(e: any, value: any) => setValue("old_assignee", value)}
                  placeholder="Select Old Assignee ..."
                  hideInvite
                />
                <Iconify sx={{ width: 50, height: 50 }} icon="mdi:transfer-right" />
                <MemberInputAutocomplete
                  multiple
                  size="small"
                  workspaceId={workspace?.id as string}
                  defaultValue={getValues("new_assignee")}
                  onChange={(e: any, value: any) => setValue("new_assignee", value)}
                  placeholder="Select New Assignee ..."
                  hideInvite
                />
              </Stack>
            </>
          )}
          {config?.showFilterRelocation && (
            <>
              <Stack spacing={1} direction="row" alignItems="center">
                <Iconify icon={RELOCATION_ICON} />
                <Typography variant="subtitle2">Relocation</Typography>
              </Stack>
              <Stack spacing={1} direction="row" alignItems="center">
                <LocationInputAutocomplete
                  multiple
                  size="small"
                  workspaceId={workspace?.id as string}
                  defaultValue={getValues("old_location")}
                  onChange={(e: any, value: any) => setValue("old_location", value)}
                  placeholder="Select Old Location ..."
                  hideCreateNew
                />
                <Iconify sx={{ width: 50, height: 50 }} icon="mdi:transfer-right" />
                <LocationInputAutocomplete
                  multiple
                  size="small"
                  workspaceId={workspace?.id as string}
                  defaultValue={getValues("new_location")}
                  onChange={(e: any, value: any) => setValue("new_location", value)}
                  placeholder="Select New Location ..."
                  hideCreateNew
                />
              </Stack>
            </>
          )}
          {config?.showFilterTransition && (
            <>
              <Stack spacing={1} direction="row" alignItems="center">
                <Iconify icon={TRANSITION_ICON} />
                <Typography variant="subtitle2">Transition</Typography>
              </Stack>
              <Stack spacing={1} direction="row" alignItems="center">
                <LifecycleInputAutocomplete
                  multiple
                  size="small"
                  workspaceId={workspace?.id as string}
                  defaultValue={getValues("old_lifecycle")}
                  onChange={(e: any, value: any) => setValue("old_lifecycle", value)}
                  placeholder="Select Old Lifecycle ..."
                  hideCreateNew
                />
                <Iconify sx={{ width: 50, height: 50 }} icon="mdi:transfer-right" />
                <LifecycleInputAutocomplete
                  multiple
                  size="small"
                  workspaceId={workspace?.id as string}
                  defaultValue={getValues("new_lifecycle")}
                  onChange={(e: any, value: any) => setValue("new_lifecycle", value)}
                  placeholder="Select New Lifecycle ..."
                  hideCreateNew
                />
              </Stack>
            </>
          )}
          <Stack spacing={1} direction="row" alignItems="center">
            <Iconify icon="solar:calendar-search-outline" />
            <Typography variant="subtitle2">Date Range</Typography>
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
