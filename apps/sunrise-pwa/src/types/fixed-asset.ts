enum AssetType {
  Tangible = "tangible",
  Intangible = "intangible",
}
export interface IFixedAssetItem {
  id?: string | any;
  workspace?: string | any;
  name: string;
  code?: string;
  serial_number?: string;
  tags?: string[] | any[];
  type: AssetType | string;
  description?: string;
  metric?: string | any;
  location?: string | any;
  lifecycle?: string | any;
  category?: string | any;
  supplier?: string | any;
  assignee?: string | any;
  hashtags?: string[] | any[];
  images: string[];
  thumbnail?: string;
  is_calculate_depreciation?: boolean;
  purchase_date?: Date;
  purchase_cost?: number;
  active_start_date?: Date;
  active_end_date?: Date;
  additional_fields?: any[];
  current_check?: any;
  current_maintenance?: any;
  warranty_expire_date?: Date;
  created_by?: string | any;
  created_at?: Date;
  updated_at?: Date;
}

export interface IFixedAssetPayload {
  id?: string | any;
  name?: string | any;
  code?: string | any;
  tags?: string[] | any[];
  serial_number?: string | any;
  type: AssetType | string;
  description?: string | any;
  location?: string | any;
  category?: string | any;
  lifecycle?: string | any;
  supplier?: string | any;
  assignee?: string | any;
  images?: string[] | any[];
  thumbnail?: string | any;
  purchase_date?: Date | any;
  purchase_cost?: number | any;
  is_calculate_depreciation?: boolean | any;
  active_start_date?: Date | any;
  active_end_date?: Date | any;
  warranty_expire_date?: Date | any;
}
