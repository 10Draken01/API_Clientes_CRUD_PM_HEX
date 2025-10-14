export class InexistPagesException extends Error {
  constructor() {
    super(`Inexist pages available.`);
    this.name = 'InexistPagesException';
  }
}