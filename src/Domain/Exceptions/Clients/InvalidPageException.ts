export class InvalidPageException extends Error {
  constructor(finalPage: number) {
    super(`Invalid page requested. It must be between 1 and ${finalPage}.`);
    this.name = 'InvalidPageException';
  }
}