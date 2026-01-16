export default interface ILifecycle {
  workspace: string;
  name: string;
  color: string | null;
  code: string | null;
  is_maintenance_cycle: boolean;
  description: string | null;
  created_by: string;
}
