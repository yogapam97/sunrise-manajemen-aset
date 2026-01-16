import moment from "moment";

import { Typography } from "@mui/material";

import Iconify from "src/components/iconify";

import { EMPTY_ICON } from "../core/icon-definitions";

type DateColumnProps = {
  date: Date | string | null | undefined;
  format?: string;
};

export default function DateColumn({ date, format = "LL" }: DateColumnProps) {
  if (!date) return <Iconify icon={EMPTY_ICON} />;
  return <Typography variant="subtitle2">{moment(date).format(format)}</Typography>;
}
