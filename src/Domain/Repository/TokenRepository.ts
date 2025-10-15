export interface TokenRepository {
  generateToken(payload: any): Promise<string>;
  verifyToken(token: string): Promise<any>;
  refreshToken(token: string): Promise<string>;
}