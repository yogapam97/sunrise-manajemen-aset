import Iconify from "src/components/iconify";

type FixedAssetIconProps = {
  width?: number;
  height?: number;
};
export default function FixedAssetIcon({ width, height }: FixedAssetIconProps) {
  return <Iconify width={width} height={height} icon="eva:cube-outline" />;
}
