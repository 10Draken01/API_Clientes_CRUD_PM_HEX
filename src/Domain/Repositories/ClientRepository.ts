import { ClientEntity } from "../Entities/ClientEntity";



export interface ClientRepository {
  createClient(client: ClientEntity): Promise<void>;
  findByClientKey(clientKey: string): Promise<ClientEntity | null>;
  deleteByClientKey(clientKey: string): Promise<ClientEntity | null>;
  updateClient(clientKey: string, name?: string, phone?: string, email?: string, characterIcon?: string): Promise<ClientEntity | null>;
  getPageClients(page: number): Promise<{ clients: ClientEntity[]; totalClients: number }>;
  getTotalPages(): Promise<number>;
}
