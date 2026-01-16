export interface IOperationGroupItem {
  id: string;
  workspace: string;
  name: string;
  is_audit: boolean;
  is_assignment: boolean;
  is_relocation: boolean;
  is_transition: boolean;
  description: string;
  created_at: Date;
  updated_at: Date;
}

export interface IOperationGroupPayload {
  fixed_asset?: string | any;
  metric?: string | any;
  value?: string | any;
  new_assignee?: string | any;
  new_location?: string | any;
  new_transition?: string | any;
  note?: string;
}
