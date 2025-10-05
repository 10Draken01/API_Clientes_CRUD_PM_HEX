import { Client } from "../../../Domain/Entities/Client";

export interface GetPageClientesResponse {
  success: boolean;
  message: string;
  clients: Client[];
  totalClients: number;
}