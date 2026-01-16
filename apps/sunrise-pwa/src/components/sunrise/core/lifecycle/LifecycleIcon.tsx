import Iconify from "src/components/iconify";

type LifecycleIconProps = {
  width?: number;
  height?: number;
};
export default function LifecycleIcon({ width, height }: LifecycleIconProps) {
  return <Iconify width={width} height={height} icon="eva:home-outline" />;
}
