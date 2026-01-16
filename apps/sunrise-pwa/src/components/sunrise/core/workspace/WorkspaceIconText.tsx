import type { TypographyProps } from "@mui/material";

import WorkspaceIcon from "./WorkspaceIcon";
import IconText from "../../common/IconText";

interface WorkspaceIconTextProps extends TypographyProps {
  width?: number;
  height?: number;
}
export default function WorkspaceIconText({ width, height, variant }: WorkspaceIconTextProps) {
  return (
    <IconText
      icon={<WorkspaceIcon width={width} height={height} />}
      variant={variant}
      text="Workspace"
    />
  );
}
