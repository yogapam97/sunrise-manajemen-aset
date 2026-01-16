import stc from "string-to-color";

import { alpha } from "@mui/material";

import Label from "src/components/label";
import Iconify from "src/components/iconify";

import { EMPTY_ICON } from "../icon-definitions";

type OperationGroupKeyViewProps = {
  operation_key: string;
};

export default function OperationGroupKeyView({ operation_key }: OperationGroupKeyViewProps) {
  if (!operation_key) return <Iconify icon={EMPTY_ICON} />;
  const color = stc(operation_key);
  return (
    <Label
      variant="soft"
      sx={{
        textTransform: "uppercase",
        backgroundColor: alpha(color, 0.2),
      }}
    >
      {operation_key}
    </Label>
  );
}
