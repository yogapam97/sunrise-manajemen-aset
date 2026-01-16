export default interface IMetric {
  workspace: string;
  name: string;
  description: string | null;
  type: string;
  min: number | null;
  max: number | null;
  default: any | null;
  labels: any[];
  created_by: string;
}
