
import { Client } from "../Entities/Client";
import { ClientUpdated } from "../Entities/ClientUpdated";

export interface ClientRepository {
  createClient(client: Client): Promise<void>;
  findByClaveClient(clave_client: string): Promise<Client | null>;
  deleteByClaveClient(clave_client: string): Promise<Client | null>;
  updateClient(client: ClientUpdated): Promise<Client | null>;
  getPageClients(page: number): Promise<{ clients: Client[]; totalClients: number }>;
  getTotalPages(): Promise<number>;
}
