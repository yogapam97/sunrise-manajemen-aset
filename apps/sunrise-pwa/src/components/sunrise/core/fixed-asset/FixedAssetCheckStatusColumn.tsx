import Iconify from "src/components/iconify";
import Label from "src/components/label/label";

import { CHECK_IN_ICON, CHECK_OUT_ICON } from "../icon-definitions";

type FixedAssetCheckStatusProps = {
  current_check: any;
};

const CheckInView = () => (
  <Label color="primary" startIcon={<Iconify icon={CHECK_IN_ICON} />}>
    Check In
  </Label>
);

const CheckOutView = () => (
  <Label color="warning" startIcon={<Iconify icon={CHECK_OUT_ICON} />}>
    Check Out
  </Label>
);
export default function FixedAssetCheckStatus({ current_check }: FixedAssetCheckStatusProps) {
  if (!current_check) return <CheckInView />;
  const { status } = current_check;
  if (status === "check-in") return <CheckInView />;
  return <CheckOutView />;
}
