import { CharacterIcontype } from "@/src/Domain/Entities/CharacterIcontype";

export interface CreateClienteRequest {
  claveCliente: number | string;
  nombre: string;
  celular: string;
  email: string;
  characterIcon: number | string | CharacterIcontype | Express.Multer.File;
}