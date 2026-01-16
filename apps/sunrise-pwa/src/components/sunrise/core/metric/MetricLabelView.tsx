import type { IMetricItem } from "src/types/metric";

import { Chip, Stack, useTheme } from "@mui/material";

import Iconify from "src/components/iconify";

type MetricLabelViewProps = {
  metric: IMetricItem;
};

export default function MetricLabelView({ metric }: MetricLabelViewProps) {
  const { type, labels } = metric;
  const theme = useTheme();
  return (
    <Stack direction="row" spacing={1}>
      {type === "categorical" &&
        labels.map((label) => (
          <Chip
            key={label.label}
            label={label.label}
            size="small"
            style={{
              backgroundColor: label.color,
              color: theme.palette.getContrastText(label.color),
            }}
          />
        ))}
      {type === "numerical" && <Iconify icon="ant-design:number-outlined" />}
    </Stack>
  );
}
