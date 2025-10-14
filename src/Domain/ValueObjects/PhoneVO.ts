export class PhoneVO {
  private readonly value: string;

  constructor(phone: string) {
    const regex = /^[0-9]{10}/;
    if(!regex.test(phone)) {
      throw new Error('Phone must contain only numeric characters and have 10 digits.');
    }

    if (!phone || phone.trim().length != 10) {
      throw new Error('Phone must have exactly 10 numeric characters. It has ' + phone.trim().length + ' characters.');
    }

    this.value = phone.trim();
  }

  getValue(): string {
    return this.value;
  }
}