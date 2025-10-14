import { InvalidPasswordException } from "../Exceptions/InvalidPasswordException";

export class PasswordVO {
  private value: string;

  constructor(plainPassword: string) {
    if (!plainPassword || plainPassword.trim().length < 6) {
      throw new InvalidPasswordException('Password must have at least 6 characters');
    }
    if (plainPassword.length > 10) {
      throw new InvalidPasswordException('Password must not exceed 10 characters');
    }

    this.value = plainPassword;
  }

  setHashedPassword(hashedPassword: string): void {
    if (!hashedPassword || hashedPassword.trim().length === 0) {
      throw new InvalidPasswordException('Password hash must not be empty');
    }
    this.value = hashedPassword;
  }

  getValue(): string {
    return this.value;
  }
}