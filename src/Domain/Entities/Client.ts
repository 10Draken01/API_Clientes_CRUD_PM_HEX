import { CharacterIcontype } from "./CharacterIcontype";


export interface Client {
  _id: string;
  claveCliente: string;
  nombre: string;
  celular: string;
  email: string;
  characterIcon: number | CharacterIcontype | Express.Multer.File;
  createdAt: Date;
  updatedAt: Date;
}