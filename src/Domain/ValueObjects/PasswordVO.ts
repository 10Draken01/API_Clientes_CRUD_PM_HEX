import { InvalidPasswordException } from "../Exceptions/Users/InvalidPasswordException";

export class PasswordVO {
  private value: string;
  //      H = entropía en bits
  private H: number = 0;
  //      L = longitud de la contraseña
  private L: number = 0;
  //      N = tamaño del espacio de caracteres
  private N: number = 0;
  //      S = fuerza de la contraseña (muy débil, débil, aceptable, fuerte, muy fuerte)
  private S: string = "Muy débil";
  //      T = tiempo estimado para crackear la contraseña (en segundos, minutos, horas, días, años)
  private T: { seconds: number; minutes: number; hours: number; days: number; years: number } = {
    seconds: 0,
    minutes: 0,
    hours: 0,
    days: 0,
    years: 0
  };


  constructor(
    plainPassword: string, 
    entropy: number = 0, 
    length: number = 0, 
    wordSpaceSize: number = 0,
    strength: string = "Muy débil",
    crackTime: { seconds: number; minutes: number; hours: number; days: number; years: number } = { seconds: 0, minutes: 0, hours: 0, days: 0, years: 0 }
  ) {

    this.value = plainPassword;
    this.H = entropy;
    this.L = length;
    this.N = wordSpaceSize;
    this.S = strength;
    this.T = crackTime;
  }

  getValue(): string {
    return this.value;
  }

  getEntropy(): number {
    return this.H;
  }

  getLength(): number {
    return this.L;
  }

  getWordSpaceSize(): number {
    return this.N;
  }

  getStrength(): string {
    return this.S;
  }

  getCrackTime(): { seconds: number; minutes: number; hours: number; days: number; years: number } {
    return this.T;
  }
}