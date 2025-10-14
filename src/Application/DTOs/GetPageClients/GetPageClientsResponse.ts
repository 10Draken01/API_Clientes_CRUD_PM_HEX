import { ClientEntity } from "src/Domain/Entities/ClientEntity";

export interface GetPageClientsResponse {
  success: boolean;
  message: string;
  clients: ClientEntity[];
  totalClients: number;
}