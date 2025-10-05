export class InexistPagesException extends Error {
  constructor() {
    super(`No existen páginas disponibles.`);
    this.name = 'InexistPagesException';
  }
}