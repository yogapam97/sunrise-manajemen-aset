import { Button, Typography } from "@mui/material";

import { paths } from "src/routes/paths";
import { RouterLink } from "src/routes/components";

import Iconify from "src/components/iconify";

import {
  EMPTY_ICON,
  CHECK_IN_ICON,
  CHECK_OUT_ICON,
  MAINTENANCE_ICON,
  OPERATION_GROUP_ICON,
} from "../icon-definitions";

type OperationGroupViewProps = {
  workspaceId: string;
  operation_group: any;
};
export default function OperationGroupView({
  workspaceId,
  operation_group,
}: OperationGroupViewProps) {
  if (!operation_group) return <Iconify icon={EMPTY_ICON} />;
  const { name, code, created_by_system } = operation_group;
  let icon = OPERATION_GROUP_ICON;
  let link = `${paths.app.operationGroup.detail(workspaceId, operation_group?._id)}?tab=operation-log`;
  let color: "info" | "primary" | "warning" | "error" = "info";
  if (code === "__CHECK_IN__" && created_by_system) {
    icon = CHECK_IN_ICON;
    link = paths.app.check.root(workspaceId);
    color = "primary";
  }
  if (code === "__CHECK_OUT__" && created_by_system) {
    icon = CHECK_OUT_ICON;
    link = paths.app.check.root(workspaceId);
    color = "warning";
  }

  if (code === "__MAINTENANCE__" && created_by_system) {
    icon = MAINTENANCE_ICON;
    link = paths.app.check.root(workspaceId);
    color = "error";
  }

  return (
    <Button
      LinkComponent={RouterLink}
      href={link}
      variant="outlined"
      color={color}
      size="small"
      startIcon={<Iconify icon={icon} />}
    >
      <Typography variant="subtitle2" noWrap>
        {name}
      </Typography>
    </Button>
  );
}
