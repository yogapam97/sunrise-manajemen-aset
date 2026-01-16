export default interface IProfilePayload {
  name: string;
  phone_number?: string | null;
  avatar?: string | any;
  password?: string | null;
  password_confirmation?: string | null;
}
