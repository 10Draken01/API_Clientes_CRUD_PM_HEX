export class InvalidCharacterIconException extends Error {
  constructor(character_icon: string) {
    super(`Character icon [ ${character_icon} ] is invalid.`);
    this.name = 'InvalidCharacterIconException';
  }
}