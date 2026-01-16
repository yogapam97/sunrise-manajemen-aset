import type { Variant } from "@mui/material/styles/createTypography";

import { Typography } from "@mui/material";

import formatCurrency from "src/utils/format-currency";

import { useWorkspaceContext } from "src/auth/hooks";

type CurrencyDisplayProps = {
  value: number | null | undefined;
  color?: string;
  variant?: Variant;
};
export default function CurrencyDisplay({
  value,
  color,
  variant = "subtitle2",
}: CurrencyDisplayProps) {
  const { workspace } = useWorkspaceContext();
  const currency = workspace?.currency;
  const thisCurrency = formatCurrency(value || 0, "en-US", currency?.code);
  return (
    <Typography variant={variant} color={color}>
      {thisCurrency}
    </Typography>
  );
}
