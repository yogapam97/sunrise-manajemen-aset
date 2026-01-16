import Iconify from "src/components/iconify";

type WorkspaceIconProps = {
  width?: number;
  height?: number;
};
export default function WorkspaceIcon({ width, height }: WorkspaceIconProps) {
  return <Iconify width={width} height={height} icon="fluent:people-team-48-regular" />;
}
