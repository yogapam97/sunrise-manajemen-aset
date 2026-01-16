import type { IMetricItem } from "src/types/metric";

import { Chip } from "@mui/material";

type AuditValueViewProps = {
  metric: IMetricItem;
  value: any;
};
export default function AuditValueView({ metric, value }: AuditValueViewProps) {
  const { type } = metric;
  if (type === "numerical") {
    return value;
  }
  if (type === "categorical") {
    return (
      <Chip
        label={value.label}
        size="small"
        sx={{
          backgroundColor: value.color,
          color: (theme) => theme.palette.getContrastText(value.color),
          "&:hover": {
            backgroundColor: value.color,
          },
        }}
      />
    );
  }
}
