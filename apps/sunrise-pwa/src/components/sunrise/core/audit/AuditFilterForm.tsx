import * as Yup from "yup";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { DatePicker } from "@mui/x-date-pickers";
import { Card, Stack, Button, Typography } from "@mui/material";

import Iconify from "src/components/iconify";
import FormProvider from "src/components/hook-form/form-provider";

import { useWorkspaceContext } from "src/auth/hooks";

import { METRIC_ICON } from "../icon-definitions";
import MetricInputAutocomplete from "../metric/MetricInputAutocomplete";

type AuditFilterFormProps = {
  defaultFilter?: any;
  onFilter: (values: any) => void;
  config?: any;
};

const AuditFilterSchema: Yup.ObjectSchema<any> = Yup.object().shape({
  metric: Yup.array().nullable(),
});

export default function AuditFilterForm({ defaultFilter, onFilter, config }: AuditFilterFormProps) {
  const { workspace } = useWorkspaceContext();

  const defaultValues: any = useMemo(
    () => ({
      metric: defaultFilter?.metric || [],
      start_date: defaultFilter?.start_date || null,
      end_date: defaultFilter?.end_date || null,
    }),
    [defaultFilter]
  );

  const methods = useForm({
    resolver: yupResolver(AuditFilterSchema),
    defaultValues,
  });

  const { handleSubmit, setValue, getValues, watch, reset } = methods;
  watch();

  const handleInputSubmit = handleSubmit(async (inputValues: any) => {
    onFilter(inputValues);
  });

  const handleReset = () => {
    reset();
    setValue("metric", []);
  };

  return (
    <Card sx={{ px: 2, pb: 2 }}>
      <FormProvider methods={methods} onSubmit={handleInputSubmit}>
        <Stack spacing={1}>
          <Stack spacing={1} direction="row" alignItems="center">
            <Iconify icon={METRIC_ICON} />
            <Typography variant="subtitle2">Metric</Typography>
          </Stack>
          <Stack spacing={1} direction="row" alignItems="center">
            <MetricInputAutocomplete
              multiple
              size="small"
              workspaceId={workspace?.id as string}
              defaultValue={getValues("metric")}
              onChange={(e: any, value: any) => setValue("metric", value)}
            />
          </Stack>
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
