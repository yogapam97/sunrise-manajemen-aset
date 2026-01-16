import Iconify from "src/components/iconify";

type MetricIconProps = {
  width?: number;
  height?: number;
};
export default function MetricIcon({ width, height }: MetricIconProps) {
  return <Iconify width={width} height={height} icon="eva:activity-outline" />;
}
