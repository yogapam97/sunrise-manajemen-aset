import Iconify from "src/components/iconify";

type DepreciationIconProps = {
  width?: number;
  height?: number;
};
export default function DepreciationIcon({ width, height }: DepreciationIconProps) {
  return <Iconify width={width} height={height} icon="eva:trending-down-outline" />;
}
