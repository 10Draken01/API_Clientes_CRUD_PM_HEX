import * as bcrypt from 'bcrypt';
import { EncryptService } from '../../Domain/Services/EncryptService';

export class BcryptService implements EncryptService {
  private readonly saltRounds = 12;

  async hash(text: string): Promise<string> {
    return await bcrypt.hash(text, this.saltRounds);
  }

  async compare(text: string, hashedText: string): Promise<boolean> {
    return await bcrypt.compare(text, hashedText);
  }
}