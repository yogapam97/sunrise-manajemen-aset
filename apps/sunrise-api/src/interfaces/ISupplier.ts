export default interface ISupplier {
  workspace: string;
  name: string;
  code: string | null;
  url: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  description: string | null;
  created_by: string;
}
