export class InvalidEmailError extends Error {
  constructor(email: string) {
    super(`El correo electrónico [ ${email} ] no es válido.`);
    this.name = 'InvalidEmailError';
  }
}
