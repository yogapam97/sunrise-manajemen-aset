import type { IMetricItem, IMetricPayload } from "src/types/metric";

import _ from "lodash";
import * as Yup from "yup";
import { useSnackbar } from "notistack";
import { MuiColorInput } from "mui-color-input";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMemo, useState, useEffect, useCallback } from "react";

import { LoadingButton } from "@mui/lab";
import {
  Box,
  Card,
  Chip,
  Grid,
  Paper,
  Stack,
  Button,
  useTheme,
  TextField,
  ButtonBase,
  Typography,
} from "@mui/material";

import Iconify from "src/components/iconify";
import { RHFTextField } from "src/components/hook-form";
import FormProvider from "src/components/hook-form/form-provider";

import { NUMERICAL_ICON, CATEGORICAL_ICON } from "../icon-definitions";

type MetricFormProps = {
  defaultMetric?: IMetricItem;
  onSubmit: (metric: IMetricPayload) => void;
  isLoading?: boolean;
  submitErrors?: any[];
};

const MetricSchema: Yup.ObjectSchema<IMetricPayload> = Yup.object().shape({
  name: Yup.string()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(60, "Name cannot be longer than 60 characters"),
  type: Yup.string().oneOf(["numerical", "categorical"]).required("Type is required"),
  labels: Yup.array()
    .of(
      Yup.object().shape({
        label: Yup.string().required("Label is required"),
        color: Yup.string().required("Color is required"),
      })
    )
    .when("type", {
      is: "categorical",
      then: (schema) =>
        schema
          .required("Labels are required when type is categorical")
          .min(1, "At least one label is required when type is categorical"),
      otherwise: (schema) => schema.notRequired().nullable(),
    }) as Yup.Schema<Array<{ label: string; color: string }> | []>,
  description: Yup.string().nullable(),
});

export default function MetricForm({
  onSubmit,
  defaultMetric,
  isLoading,
  submitErrors,
}: MetricFormProps) {
  const theme = useTheme();
  const [labelColor, setLabelColor] = useState("#000000");
  const [labelName, setLabelName] = useState("");
  const defaultValues: IMetricPayload = useMemo(
    () => ({
      name: defaultMetric?.name || "",
      type: defaultMetric?.type || "categorical",
      labels: defaultMetric?.labels || [],
      description: defaultMetric?.description || "",
    }),
    [defaultMetric]
  );

  const { enqueueSnackbar } = useSnackbar();

  const methods = useForm({
    resolver: yupResolver(MetricSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    control,
    setError,
    getValues,
    watch,
    setValue,
    formState: { errors },
  } = methods;
  watch();

  const handleChangeLabelName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLabelName(event.target.value);
  };

  const handleAddLabel = useCallback(() => {
    if (labelName) {
      setValue("labels", [...getValues("labels"), { label: labelName, color: labelColor }]);
      setLabelName("");
      setLabelColor("#fff");
    }
  }, [getValues, setValue, labelName, labelColor]);

  const handleDeleteLabel = (index: number) => {
    const labels = getValues("labels");
    labels.splice(index, 1);
    setValue("labels", labels);
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

  const handleInputSubmit = handleSubmit(async (values: any) => {
    if (values.type === "category" && values.labels.length === 0) {
      setError("labels", { message: "Please add at least one label" });
      return;
    }
    onSubmit(values);
  });

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <Card sx={{ p: 2 }}>
          <FormProvider methods={methods} onSubmit={handleInputSubmit}>
            <Stack spacing={2}>
              <Stack spacing={2}>
                <Typography variant="subtitle2">Name</Typography>
                <RHFTextField
                  name="name"
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  fullWidth
                  variant="outlined"
                  placeholder="Enter metric name ..."
                />
              </Stack>

              <Stack spacing={2}>
                <Typography variant="subtitle2">Type</Typography>
                <Controller
                  name="type"
                  control={control}
                  render={({ field }) => (
                    <Box gap={2} display="grid" gridTemplateColumns="repeat(2, 1fr)">
                      {[
                        {
                          label: "Categorical",
                          value: "categorical",
                          icon: <Iconify icon={CATEGORICAL_ICON} width={32} sx={{ mb: 2 }} />,
                        },
                        {
                          label: "Numerical",
                          value: "numerical",
                          icon: <Iconify icon={NUMERICAL_ICON} width={32} sx={{ mb: 2 }} />,
                        },
                      ].map((item) => (
                        <Paper
                          component={ButtonBase}
                          variant="outlined"
                          key={item.label}
                          onClick={() => field.onChange(item.value)}
                          sx={{
                            p: 1,
                            borderRadius: 1,
                            typography: "subtitle2",
                            flexDirection: "column",
                            ...(item.value === field.value && {
                              borderWidth: 1,
                              borderColor: "text.primary",
                            }),
                          }}
                        >
                          {item.icon}
                          {item.label}
                        </Paper>
                      ))}
                    </Box>
                  )}
                />
              </Stack>
              {getValues("type") === "categorical" && (
                <Stack spacing={2}>
                  <Typography variant="subtitle2">Labels</Typography>
                  <Stack direction="row" spacing={2}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      value={labelName}
                      onChange={handleChangeLabelName}
                      placeholder="Enter label name ..."
                    />
                    <MuiColorInput value={labelColor} onChange={setLabelColor} format="hex" />
                  </Stack>
                  <Button variant="outlined" onClick={handleAddLabel}>
                    Add Label
                  </Button>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {getValues("labels").map((label: any, index: number) => (
                      <Chip
                        key={index}
                        label={label.label}
                        style={{
                          backgroundColor: label.color,
                          color: theme.palette.getContrastText(label.color),
                        }}
                        size="small"
                        onDelete={() => handleDeleteLabel(index)}
                      />
                    ))}
                  </Box>
                  {getValues("labels").length > 0 && (
                    <Button variant="text" size="small" onClick={() => setValue("labels", [])}>
                      Clear Label
                    </Button>
                  )}
                  {errors.labels && (
                    <Typography variant="body2" color="error">
                      {errors?.labels?.message}
                    </Typography>
                  )}
                </Stack>
              )}

              <Stack spacing={2}>
                <Typography variant="subtitle2">Description</Typography>
                <RHFTextField
                  name="description"
                  fullWidth
                  multiline
                  rows={4}
                  variant="outlined"
                  placeholder="Enter metric description ..."
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
                  Save Metric
                </LoadingButton>
              </Stack>
            </Stack>
          </FormProvider>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Stack spacing={1} sx={{ mt: 2 }}>
          <Typography variant="h6">Categorical Metrics</Typography>
          <Typography variant="body2">
            <b>Choose Categorical</b> if your metric involves qualitative performance data related
            to fixed assets, such as asset condition (e.g., Excellent, Good, Poor) or usage type
            (e.g., Heavy, Moderate, Light). This option is ideal for metrics that require
            categorization and qualitative assessment to document the performance of the assets.
          </Typography>
        </Stack>
        <Stack spacing={1}>
          <Typography variant="h6">Numerical Metrics</Typography>
          <Typography variant="body2">
            <b>Choose Numerical</b> if your metric involves quantifiable performance data related to
            fixed assets, such as usage frequency, operational hours, or energy consumption. This
            option is ideal for metrics that require numerical analysis and precise calculations to
            assess the performance and efficiency of the assets.
          </Typography>
        </Stack>
      </Grid>
    </Grid>
  );
}
