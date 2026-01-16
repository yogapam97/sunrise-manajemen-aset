export interface IMaintenanceItem {
  id?: string | any;
  workspace?: string | any;
  fixed_asset?: string | any;
  is_transition?: boolean;
  lifecycle?: any;
  maintenance_cost?: number;
  maintenance_date?: Date;
  maintenance_next_date?: Date;
  maintained_by?: string | any;
  note?: string;
  created_at?: string | any;
}

export interface IMaintenancePayload {
  id?: string | any;
  workspace?: string | any;
  fixed_asset?: string | any;
  is_transition?: boolean;
  lifecycle?: any;
  maintenance_cost?: number;
  maintenance_date?: Date;
  maintenance_next_date?: Date;
  maintained_by?: string | any;
  note?: string;
}
