export interface IMetricItem {
  id?: string;
  workspace: string | any;
  name: string;
  type: "numerical" | "categorical";
  labels: [{ label: string; color: string }];
  description: string;
  created_by: string | any;
  created_at: string;
}

export interface IMetricPayload {
  name: string;
  type: "numerical" | "categorical";
  labels: Array<{ label: string; color: string }> | [];
  description: string | undefined | null;
}
