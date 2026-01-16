export default interface IMaintenance {
  workspace: string;
  fixed_asset: string;
  is_transition: boolean;
  lifecycle: any;
  maintenance_cost: number;
  maintenance_date: Date;
  maintenance_next_date: Date;
  maintained_by: string;
  note: string | null;
}
