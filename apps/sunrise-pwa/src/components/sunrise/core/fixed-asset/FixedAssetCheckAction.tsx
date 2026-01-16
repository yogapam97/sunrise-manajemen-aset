import { Button } from "@mui/material";

import { paths } from "src/routes/paths";
import { RouterLink } from "src/routes/components";

import Iconify from "src/components/iconify/iconify";

import { CHECK_IN_ICON, CHECK_OUT_ICON } from "../icon-definitions";

type FixedAssetCheckStatusProps = {
  workspaceId: string;
  id: string;
  current_check: any;
};
const CheckInAction = ({ workspaceId, id }: { workspaceId: string; id: string }) => (
  <Button
    size="small"
    color="primary"
    variant="contained"
    startIcon={<Iconify icon={CHECK_IN_ICON} />}
    component={RouterLink}
    href={paths.app.check.create(workspaceId, id)}
    sx={{ width: 110 }}
  >
    Check In
  </Button>
);
const CheckOutAction = ({ workspaceId, id }: { workspaceId: string; id: string }) => (
  <Button
    size="small"
    color="warning"
    variant="contained"
    startIcon={<Iconify icon={CHECK_OUT_ICON} />}
    component={RouterLink}
    sx={{ width: 110 }}
    href={paths.app.check.create(workspaceId, id)}
  >
    Check Out
  </Button>
);
export default function FixedAssetCheckAction({
  id,
  workspaceId,
  current_check,
}: FixedAssetCheckStatusProps) {
  if (!current_check) return <CheckOutAction workspaceId={workspaceId} id={id} />;
  const { status } = current_check;
  if (status === "check-in") return <CheckOutAction workspaceId={workspaceId} id={id} />;
  return <CheckInAction workspaceId={workspaceId} id={id} />;
}
