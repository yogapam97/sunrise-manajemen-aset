export default interface IWorkspace {
  name: string;
  email: string;
  phone: string;
  default_icon: string;
  description: string;
  logo_full: string;
  logo_square: string;
  currency: object;
  time_zone: object;
  created_by: string;
  logo: string | null;
}
