
import { InexistPagesException } from "../Exceptions/Clients/InexistPagesException";
import { InvalidPageException } from "../Exceptions/Clients/InvalidPageException";

export class PageVO {
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