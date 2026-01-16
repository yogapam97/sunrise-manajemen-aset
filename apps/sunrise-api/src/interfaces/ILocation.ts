export default interface ILocation {
  workspace: string;
  name: string;
  code: string | null;
  address: string | null;
  description: string | null;
  created_by: string;
}
