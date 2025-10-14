export class UsernameVO {
  private readonly value: string;

  constructor(name: string) {
    if (!name || name.trim().length < 2) {
      throw new Error('Name must have at least 2 characters');
    }
    if (name.length > 100) {
      throw new Error('Name must not exceed 100 characters');
    }
    this.value = name.trim();
  }

  getValue(): string {
    return this.value;
  }
}