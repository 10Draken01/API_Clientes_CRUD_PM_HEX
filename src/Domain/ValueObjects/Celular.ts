export class Celular {
  private readonly value: string;

  constructor(celular: string) {
    const regex = /^[0-9]{10}/;
    if(!regex.test(celular)) {
      throw new Error('El celular debe contener solo caracteres numericos y tener 10 digitos.');
    }
    
    if (!celular || celular.trim().length != 10) {
      throw new Error('El celular debe tener al menos 10 caracteres numericos. Tiene ' + celular.trim().length + ' caracteres.');
    }

    this.value = celular.trim();
  }

  getValue(): string {
    return this.value;
  }
}