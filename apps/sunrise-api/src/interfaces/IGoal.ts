export default interface Goal {
  workspace: string;
  name: string;
  description: string | null;
  metric: string;
  expire_date: Date | null;
  aggregate: string | null;
  label_target: string | null;
  target: number;
  created_by: string;
}
