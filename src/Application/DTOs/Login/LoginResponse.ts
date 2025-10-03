export interface LoginResponse {
  _id: string;
  username: string;
  email: string;
  token: string;
  expiresIn: number;
}