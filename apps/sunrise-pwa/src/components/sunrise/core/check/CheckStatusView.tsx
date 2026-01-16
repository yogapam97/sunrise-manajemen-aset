import Iconify from "src/components/iconify";
import Label from "src/components/label/label";

import { CHECK_IN_ICON, CHECK_OUT_ICON } from "../icon-definitions";

type CheckStatusViewProps = {
  status: string | null;
};

const CheckInView = () => (
  <Label sx={{ width: 100 }} color="primary" startIcon={<Iconify icon={CHECK_IN_ICON} />}>
    Check In
  </Label>
);

const CheckOutView = () => (
  <Label sx={{ width: 100 }} color="warning" startIcon={<Iconify icon={CHECK_OUT_ICON} />}>
    Check Out
  </Label>
);
export default function CheckStatusView({ status }: CheckStatusViewProps) {
  if (!status) return <CheckInView />;
  if (status === "check-in") return <CheckInView />;
  return <CheckOutView />;
}
