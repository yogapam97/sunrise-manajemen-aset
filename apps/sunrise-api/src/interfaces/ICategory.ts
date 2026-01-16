export default interface ICategory {
  workspace: string;
  name: string;
  code: string | null;
  icon: string | null;
  description: string | null;
  created_by: string;
}
