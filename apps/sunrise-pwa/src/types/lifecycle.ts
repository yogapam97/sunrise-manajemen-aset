export type ILifecycleItem = {
  id?: string;
  workspace?: string | any;
  name: string;
  color?: string;
  code?: string;
  is_maintenance_cycle?: boolean | null;
  description?: string;
  created_at?: Date;
  updated_at?: Date;
};

export interface ILifecyclePayload {
  code?: string | null;
  name: string;
  is_maintenance_cycle?: boolean | null;
  description?: string | null;
  color?: string | null;
}
