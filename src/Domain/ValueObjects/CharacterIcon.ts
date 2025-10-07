import { CharacterIcontype } from "../Entities/CharacterIcontype";

export class CharacterIcon {
  private readonly value: number | CharacterIcontype | Express.Multer.File;
  public readonly type: 'Icon' | 'URL' | 'File';

  constructor(characterIcon: string | number | CharacterIcontype | Express.Multer.File) {
    if (typeof characterIcon === 'number') {
      if (characterIcon < 0 || characterIcon > 9) {
        throw new Error('CharacterIcon number must be between 0 and 9.');
      }
      this.value = characterIcon;
      this.type = 'Icon';
    } 
    else if (typeof characterIcon === 'string') {
      const regexNumeric09 = /^[0-9]{1}$/;
      if (!regexNumeric09.test(characterIcon)) {
        throw new Error('CharacterIcon string must be a single digit (0-9).');
      }
      this.value = parseInt(characterIcon, 10);
      this.type = 'Icon';
    } 
    else if (typeof characterIcon === 'object' && characterIcon !== null && 'id' in characterIcon && 'url' in characterIcon) {
      this.value = characterIcon;
      this.type = 'URL';
    } 
    else if (characterIcon && typeof characterIcon === 'object' && 'path' in characterIcon) {
      // Detecta que es un archivo Multer
      this.value = characterIcon;
      this.type = 'File';
    } 
    else {
      console.error('Invalid CharacterIcon value:', characterIcon, typeof characterIcon);
      throw new Error('Invalid CharacterIcon type.');
    }
    console.log(`CharacterIcon created with kind: ${this.type}`);
    console.log('CharacterIcon value:', this.value);
  }

  getValue(): number | CharacterIcontype | Express.Multer.File {
    return this.value;
  }
}
