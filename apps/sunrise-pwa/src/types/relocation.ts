export interface IRelocationItem {
  id?: string | any;
  workspace?: string | any;
  fixed_asset?: string | any;
  old_location?: string | any;
  new_location?: string | any;
  relocated_by?: string | any;
  note?: string;
  created_at?: string | any;
}

export interface IRelocationPayload {
  id?: string | any;
  workspace?: string | any;
  fixed_asset?: string | any;
  old_location?: string | any;
  new_location?: string | any;
  relocated_by?: string | any;
  note?: string;
}
