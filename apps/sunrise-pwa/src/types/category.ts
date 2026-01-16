export interface ICategoryItem {
  id?: string | any;
  workspace?: string | any;
  code?: string;
  name: string;
  icon?: string;
  description?: string;
  created_at?: Date;
  updated_at?: Date;
  created_by?: any;
  address?: string;
  fixed_asset_total_count?: number;
  fixed_asset_total_value?: number;
  fixed_asset_total_depreciation?: number;
}

export interface ICategoryPayload {
  code?: string | null;
  name: string;
  description?: string | null;
}
