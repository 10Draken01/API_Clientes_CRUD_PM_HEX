export class NameVO {
  private readonly value: string;

  constructor(name: string) {
    if (!name || name.trim().length < 3) {
      throw new Error('name must have at least 3 characters');
    }
    if (name.length > 100) {
      throw new Error('name must not have more than 100 characters');
    }
    this.value = name.trim();
  }

  getValue(): string {
    return this.value;
  }
}