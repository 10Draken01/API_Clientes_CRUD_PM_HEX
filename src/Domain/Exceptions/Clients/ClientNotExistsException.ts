export class ClientNotExistsException extends Error {
  constructor(clave_cliente: string) {
    super(`Client with key ${clave_cliente} does not exist.`);
    this.name = 'ClienteNotExistsException';
  }
}