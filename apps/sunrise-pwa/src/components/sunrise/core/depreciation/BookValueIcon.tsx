import Iconify from "src/components/iconify";

type BookValueIconProps = {
  width?: number;
  height?: number;
};
export default function BookValueIcon({ width, height }: BookValueIconProps) {
  return <Iconify width={width} height={height} icon="mdi:book-outline" />;
}
