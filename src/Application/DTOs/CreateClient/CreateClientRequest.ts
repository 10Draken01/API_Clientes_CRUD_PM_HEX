import { CharacterIconType } from "src/Domain/Types/CharacterIcontype";

export interface CreateClientRequest {
  clientKey: number | string;
  name: string;
  phone: string;
  email: string;
  characterIcon: CharacterIconType;
}