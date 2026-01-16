export interface ISupplierItem {
  id?: string | any;
  workspace?: string | any;
  code?: string;
  name: string;
  url?: string;
  email?: string;
  phone?: string;
  description?: string;
  created_at?: Date;
  created_by?: any;
  address?: string;
  fixed_asset_total_count?: number;
  fixed_asset_total_value?: number;
  fixed_asset_total_depreciation?: number;
}

export interface ISupplierPayload {
  code?: string | null;
  name: string;
  url?: string | null;
  email?: string | null;
  phone?: string | null;
  description?: string | null;
  address?: string | null;
}
