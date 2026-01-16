export default interface IUser {
  name: string;
  email: string;
  avatar?: string | null;
  phone_number?: string | null;
  password: string;
  email_verified: boolean;
}
