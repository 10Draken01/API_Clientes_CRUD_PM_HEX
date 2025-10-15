export class UserNotExistsException extends Error {
  constructor(email: string) {
    super(`User with email ${email} does not exist.`);
    this.name = 'UserNotExistsException';
  }
}