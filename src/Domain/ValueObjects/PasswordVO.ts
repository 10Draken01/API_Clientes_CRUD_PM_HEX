import { InvalidPasswordException } from "../Exceptions/Users/InvalidPasswordException";

export class PasswordVO {
  private value: string;
  private H: number = 0;
  private L: number = 0;
  private N: number = 0;
  private S: string = "Muy débil";
  private T: { seconds: number; minutes: number; hours: number; days: number; years: number } = {
    seconds: 0,
    minutes: 0,
    hours: 0,
    days: 0,
    years: 0
  };
  private causes: string[] = [];

  constructor(
    plainPassword: string, 
    entropy: number = 0, 
    length: number = 0, 
    wordSpaceSize: number = 0,
    strength: string = "Muy débil",
    crackTime: { seconds: number; minutes: number; hours: number; days: number; years: number } = { seconds: 0, minutes: 0, hours: 0, days: 0, years: 0 },
    causes: string[] = []
  ) {
    this.value = plainPassword;
    this.H = entropy;
    this.L = length;
    this.N = wordSpaceSize;
    this.S = strength;
    this.T = crackTime;
    this.causes = causes;
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

  getCauses(): string[] {
    return this.causes;
  }

  getFormattedCrackTime(): string {
    if (this.T.years > 1000000) {
      return `${(this.T.years / 1000000).toFixed(2)} million years`;
    } else if (this.T.years > 1000) {
      return `${(this.T.years / 1000).toFixed(2)} thousand years`;
    } else if (this.T.years >= 1) {
      return `${this.T.years.toFixed(2)} years`;
    } else if (this.T.days >= 1) {
      return `${this.T.days.toFixed(2)} days`;
    } else if (this.T.hours >= 1) {
      return `${this.T.hours.toFixed(2)} hours`;
    } else if (this.T.minutes >= 1) {
      return `${this.T.minutes.toFixed(2)} minutes`;
    } else {
      return `${this.T.seconds.toFixed(2)} seconds`;
    }
  }
}