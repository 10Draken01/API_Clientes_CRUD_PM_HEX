import { InvalidEmailError } from "../Exceptions/Users/InvalidEmailError";

export class EmailVO {
  private readonly value: string;
  private readonly emailTypes = [
    'gmail.com',
    'yahoo.com',
    'outlook.com',
  ];

  constructor(email: string) {
    if (!this.isValid(email)) {
      console.error('Invalid email: ', email);
      throw new InvalidEmailError(email);
    }
    this.value = email;
  }

  getValue(): string {
    return this.value;
  }

  private isValid(email: string): boolean {
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!emailRegex.test(email)) return false;

    // Verificar dominio permitido
    const domain = email.split('@')[1].toLowerCase();
    return this.emailTypes.includes(domain);
  }

}