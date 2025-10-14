
export class ClientKeyVO {
  private readonly value: string;

  constructor(clientKey: string | number) {
    const clientKeyStr = clientKey.toString();
    if (!this.isValid(clientKeyStr)) {
      throw new Error('ClientKey must contain only numeric characters.');
    }
    this.value = clientKeyStr;
  }

  getValue(): string {
    return this.value;
  }

  private isValid(clientKey: string): boolean {
    // tiene que tene solo caracteres numericos
    const clientKeyRegex = /^[0-9]+$/;
    return clientKeyRegex.test(clientKey);
  }
}