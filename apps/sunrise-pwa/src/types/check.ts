export interface ICheckItem {
  id?: string | any;
  workspace?: string | any;
  fixed_asset?: string | any;
  status?: string | any;
  assignee?: string | any;
  is_assignment?: boolean;
  location?: string | any;
  is_relocation?: boolean;
  checked_by?: string | any;
  note?: string;
  created_at?: string | any;
}

export interface ICheckPayload {
  id?: string | any;
  workspace?: string | any;
  fixed_asset?: string | any;
  status?: string | any;
  assignee?: string | any;
  is_assignment?: boolean;
  location?: string | any;
  is_relocation?: boolean;
  member?: string | any;
  checked_by?: string | any;
  note?: string;
}
