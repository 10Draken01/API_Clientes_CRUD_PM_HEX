export interface EncryptRepository {
  hash(text: string): Promise<string>;
  compare(text: string, hashedText: string): Promise<boolean>;
}