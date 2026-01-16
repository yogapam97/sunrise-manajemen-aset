import { Button } from "@mui/material";

import { paths } from "src/routes/paths";
import { RouterLink } from "src/routes/components";

import Iconify from "src/components/iconify/iconify";

import { TRANSITION_ICON, MAINTENANCE_ICON } from "../icon-definitions";

type FixedAssetMaintenanceStatusProps = {
  workspaceId: string;
  fixedAsset: any;
};
const TransitionAction = ({ workspaceId, id }: { workspaceId: string; id: string }) => (
  <Button
    size="small"
    color="primary"
    variant="contained"
    startIcon={<Iconify icon={TRANSITION_ICON} />}
    component={RouterLink}
    sx={{ width: 110 }}
    href={paths.app.transition.create(workspaceId, id)}
  >
    Transition
  </Button>
);
const MaintenanceAction = ({ workspaceId, id }: { workspaceId: string; id: string }) => (
  <Button
    size="small"
    color="error"
    variant="contained"
    startIcon={<Iconify icon={MAINTENANCE_ICON} />}
    component={RouterLink}
    href={paths.app.maintenance.create(workspaceId, id)}
    sx={{ width: 110 }}
  >
    Maintain
  </Button>
);
export default function FixedAssetMaintenanceAction({
  workspaceId,
  fixedAsset,
}: FixedAssetMaintenanceStatusProps) {
  if (!fixedAsset?.current_maintenance || !fixedAsset?.lifecycle?.is_maintenance_cycle)
    return <MaintenanceAction workspaceId={workspaceId} id={fixedAsset?.id} />;

  return <TransitionAction workspaceId={workspaceId} id={fixedAsset?.id} />;
}
