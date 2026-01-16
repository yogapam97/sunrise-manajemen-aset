import _ from "lodash";

import { Tooltip, Typography } from "@mui/material";

import Iconify from "src/components/iconify";

import { EMPTY_ICON } from "../icon-definitions";

type FixedAssetSerialNumberColumnProps = {
  serial_number: string;
};
export default function FixedAssetSerialNumberColumn({
  serial_number,
}: FixedAssetSerialNumberColumnProps) {
  if (!serial_number) return <Iconify icon={EMPTY_ICON} />;
  return (
    <Tooltip title={_.size(serial_number) > 20 ? serial_number : ""} placement="bottom-start" arrow>
      <Typography
        noWrap
        variant="subtitle2"
        sx={{
          maxWidth: 300,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {serial_number}
      </Typography>
    </Tooltip>
  );
}
