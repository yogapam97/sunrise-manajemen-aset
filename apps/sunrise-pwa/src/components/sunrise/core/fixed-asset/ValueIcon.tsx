import Iconify from "src/components/iconify";

type ValueIconProps = {
  width?: number;
  height?: number;
};
export default function ValueIcon({ width, height }: ValueIconProps) {
  return <Iconify width={width} height={height} icon="mdi:note-text-outline" />;
}
