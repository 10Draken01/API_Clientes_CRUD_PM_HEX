import { CharacterIconType } from "../Types/CharacterIcontype";

export interface ClientEntity {
  _id: string;
  clientKey: string;
  name: string;
  phone: string;
  email: string;
  characterIcon: CharacterIconType;
  createdAt: Date;
  updatedAt: Date;
}