import { Chip } from "@mui/material";

import Iconify from "src/components/iconify";

import { NUMERICAL_ICON, CATEGORICAL_ICON } from "../icon-definitions";

type MetricTypeViewProps = {
  type: string;
};
export default function MetricTypeView({ type }: MetricTypeViewProps) {
  if (type === "numerical") {
    return <Chip label="Numerical" icon={<Iconify icon={NUMERICAL_ICON} />} />;
  }
  if (type === "categorical") {
    return <Chip label="Categorical" icon={<Iconify icon={CATEGORICAL_ICON} />} />;
  }
}
