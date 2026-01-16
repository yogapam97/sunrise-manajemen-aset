export interface IAuditItem {
  id?: string | any;
  workspace?: string | any;
  fixed_asset?: string | any;
  metric?: string | any;
  value?: string | any;
  audited_by?: string | any;
  note?: string;
  created_at?: string | any;
}

export interface IAuditPayload {
  id?: string | any;
  workspace?: string | any;
  fixed_asset?: string | any;
  metric?: string | any;
  value?: string | any;
  audited_by?: string | any;
  note?: string;
}
