import Iconify from "src/components/iconify";

type LocationIconProps = {
  width?: number;
  height?: number;
};
export default function LocationIcon({ width, height }: LocationIconProps) {
  return <Iconify width={width} height={height} icon="material-symbols:location-on-outline" />;
}
