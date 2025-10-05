
import { InexistPagesException } from "../../Application/Exceptions/InexistPagesException";
import { InvalidPageException } from "../../Application/Exceptions/InvalidPageException";

export class Page {
  private readonly value: number;

  constructor(page: number, finalPage: number) {
    if (finalPage < 1) {
      throw new InexistPagesException();
    }
    if (page < 1 || page > finalPage) {
      throw new InvalidPageException(finalPage);
    }
    this.value = page;
  }

  getValue(): number {
    return this.value;
  }
} 