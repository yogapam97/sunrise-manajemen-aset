export default interface AuthResponse {
  data: {
    profile: Record<string, any>;
    access_token: string;
    refresh_token: string;
  };
  success: boolean;
}
