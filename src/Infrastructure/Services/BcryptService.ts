import * as bcrypt from 'bcrypt';
import { EncryptRepository } from '../../Domain/Repository/EncryptRepository';

export class BcryptService implements EncryptRepository {
  private readonly saltRounds = 12;

  async hash(text: string): Promise<string> {
    return await bcrypt.hash(text, this.saltRounds);
  }

  async compare(text: string, hashedText: string): Promise<boolean> {
    return await bcrypt.compare(text, hashedText);
  }
}