export interface IUserItem {
  id?: string;
  avatar?: string;
  workspace?: string | any;
  name: string;
  email?: string;
  created_at?: Date;
  created_by?: any;
  address?: string;
  fixed_asset_total_count?: number;
  fixed_asset_total_value?: number;
  fixed_asset_total_depreciation?: number;
}

export interface IUserPayload {
  name: string;
  email?: string | null;
}
