import Iconify from "src/components/iconify";

type CategoryIconProps = {
  width?: number;
  height?: number;
};
export default function CategoryIcon({ width, height }: CategoryIconProps) {
  return <Iconify width={width} height={height} icon="eva:at-outline" />;
}
