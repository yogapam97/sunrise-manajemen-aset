export interface IDepreciationItem {
  id?: string;
  workspace?: string | any;
  name?: string;
  code?: string;
  serial_number?: string;
  type?: "tangible" | "intangible" | undefined;
  description?: string;
  metric?: string | any;
  location?: string | any;
  lifecycle?: string | any;
  category?: string | any;
  assignee?: string | any;
  supplier?: string | any;
  hashtags?: string[] | any[];
  images?: string[];
  thumbnail?: string;
  is_calculate_depreciation?: boolean;
  purchase_date?: Date;
  purchase_cost?: number | undefined;
  active_start_date?: Date;
  active_end_date?: Date;
  additional_fields?: any[];
  created_by?: string | any;
  created_at?: Date;
  updated_at?: Date;
  depreciation_rate?: number;
  percentage?: number;
  depreciation_purchase_cost?: number;
  current_purchase_cost?: number;
}

export interface IDepreciationPayload {
  name?: string;
  code?: string;
  type?: "tangible" | "intangible";
  description?: string | any;
  location?: string | any;
  category?: string | any;
  lifecycle?: string | any;
  assignee?: string | any;
  images?: string[];
  thumbnail?: string | any;
  purchase_date?: Date;
  purchase_cost?: number;
}
