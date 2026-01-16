import type { IMetricItem } from "src/types/metric";

import { Stack, Button, Typography } from "@mui/material";

import Iconify from "src/components/iconify";

import AuditValueView from "./AuditValueView";
import { NUMERICAL_ICON, CATEGORICAL_ICON } from "../icon-definitions";

type AuditColumnProps = {
  metric: IMetricItem;
  value: any;
};
export default function AuditColumn({ metric, value }: AuditColumnProps) {
  if (!metric) return "-";
  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Button
        variant="outlined"
        size="small"
        startIcon={
          <Iconify icon={metric?.type === "numerical" ? NUMERICAL_ICON : CATEGORICAL_ICON} />
        }
      >
        <Typography variant="subtitle2" noWrap>
          {metric?.name}
        </Typography>
      </Button>
      <Iconify icon="mdi:transfer-right" />
      <AuditValueView value={value} metric={metric} />
    </Stack>
  );
}
