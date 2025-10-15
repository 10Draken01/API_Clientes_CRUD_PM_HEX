import { InvalidPasswordException } from "../Exceptions/Users/InvalidPasswordException";

export class HashedPasswordVO {
  constructor(private readonly value: string) {
    if (!value || value.trim().length === 0) {
      throw new InvalidPasswordException('Password hash must not be empty');
    }
  }
  getValue(): string {
    return this.value;
  }
}
