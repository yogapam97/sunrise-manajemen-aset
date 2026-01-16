export interface IMemberItem {
  id: string;
  user?: string | any; // reference to User model
  code?: string;
  workspace?: string | any; // reference to Workspace model
  invitation_status: "pending" | "accepted" | "rejected" | "mastered";
  email: string;
  role?: string;
  admin_permissions?: any[];
  created_at?: Date;
  updated_at?: Date;
}

export interface IMemberPayload {
  email: string;
  role: string;
  code?: string | null;
}
