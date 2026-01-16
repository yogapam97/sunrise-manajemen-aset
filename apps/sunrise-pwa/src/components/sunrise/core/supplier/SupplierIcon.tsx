import Iconify from "src/components/iconify";

import { SUPPLIER_ICON } from "../icon-definitions";

type SupplierIconProps = {
  width?: number;
  height?: number;
};
export default function SupplierIcon({ width, height }: SupplierIconProps) {
  return <Iconify width={width} height={height} icon={SUPPLIER_ICON} />;
}
