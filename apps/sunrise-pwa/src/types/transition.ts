export interface ITransitionItem {
  id?: string | any;
  workspace?: string | any;
  fixed_asset?: string | any;
  old_lifecycle?: string | any;
  new_lifecycle?: string | any;
  transitioned_by?: string | any;
  note?: string;
  created_at?: string | any;
}

export interface ITransitionPayload {
  id?: string | any;
  workspace?: string | any;
  fixed_asset?: string | any;
  old_lifecycle?: string | any;
  new_lifecycle?: string | any;
  transitioned_by?: string | any;
  note?: string;
}
