export interface IAssignmentItem {
  id?: string | any;
  workspace?: string | any;
  fixed_asset?: string | any;
  old_assignee?: string | any;
  new_assignee?: string | any;
  assigned_by?: string | any;
  note?: string;
  created_at?: string | any;
}

export interface IAssignmentPayload {
  id?: string | any;
  workspace?: string | any;
  fixed_asset?: string | any;
  old_assignee?: string | any;
  new_assignee?: string | any;
  assigned_by?: string | any;
  note?: string;
}
