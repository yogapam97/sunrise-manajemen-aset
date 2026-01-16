export default interface IAssessment {
  workspace: string;
  fixed_asset: string;
  metric: string;
  assessed_by: string;
  value: any;
  note: string | null;
}
