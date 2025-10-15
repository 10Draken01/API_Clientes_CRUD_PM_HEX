export class ClienteAlreadyExistsException extends Error {
  constructor(clave_cliente: string) {
    super(`Client with key ${clave_cliente} already exists.`);
    this.name = 'ClienteAlreadyExistsException';
  }
}