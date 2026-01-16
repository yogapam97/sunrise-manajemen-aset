import type IAdditionalField from "./IAdditionalField";

export default interface IFixedAsset {
  workspace: string;
  name: string;
  code: string;
  serial_number: string;
  tags: string[];
  description: string;
  type: "tangible" | "intangible";
  metric: string | object | null;
  location: string | object | null;
  lifecycle: string | object | null;
  supplier: string | object | null;
  category: string | object | null;
  assignee: string | object | null;
  hashtags: string[];
  images: string[];
  thumbnail: string | null;
  is_calculate_depreciation: boolean;
  purchase_date: Date | null;
  purchase_cost: number;
  active_start_date: Date | null;
  active_end_date: Date | null;
  warranty_expire_date: Date | null;
  additional_fields: IAdditionalField[];
  created_by?: string;
}
