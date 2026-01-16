// ----------------------------------------------------------------------

import type { Currency } from "./currency";
import type { IMemberItem } from "./member";

export type IWorkspaceItem = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  role?: string;
  currency?: Currency | null;
  default_icon?: string;
  description?: string;
  created_at?: Date;
  members_count?: number;
  logo?: string;
  created_by?: any;
  invitation_status: string;
  time_zone?: string;
};

export type WorkspaceContextType = {
  workspace: IWorkspaceItem | null;
  member: IMemberItem | null;
  workspaceSelected: boolean;
  loading: boolean;
  memberLoading: boolean;
  setWorkspace: (workspace: IWorkspaceItem | null) => Promise<void>;
  setMember: (member: IMemberItem | null) => Promise<void>;
  setMemberLoading: (loading: boolean) => Promise<void>;
};

export type IWorkspacePayload = {
  name: string;
  email?: string;
  phone?: string;
  description?: string;
  currency: Currency | null;
  default_icon?: string;
  // time_zone?: Timezone | null;
  logo?: string | null;
};

export type WorkspaceStateType = {
  loading: boolean;
  workspace: IWorkspaceItem | null;
  member: IMemberItem | null;
  memberLoading: boolean;
};

export type WorkspaceActionMapType<M extends { [index: string]: any }> = {
  [Key in keyof M]: M[Key] extends undefined
    ? {
        type: Key;
      }
    : {
        type: Key;
        payload: M[Key];
      };
};
