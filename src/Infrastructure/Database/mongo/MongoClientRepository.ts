import { Db, Collection } from 'mongodb';
import { ClientRepository } from '../../../Domain/Repositories/ClienteRepository';
import { Client } from '@/src/Domain/Entities/Client';


export class MongoClientRepository implements ClientRepository {
  private readonly collection: Collection<Client>;

  constructor(database: Db) {
    this.collection = database.collection<Client>('clients');
  }

  async createClient(cliente: Client): Promise<void> {
    try {
      await this.collection.insertOne(cliente);
    } catch (error: any) {
      if (error.code === 11000) {
        throw new Error('Cliente ya existe con esa clave o email');
      }
      throw error;
    }
  }

  async findByClaveClient(clave_cliente: string): Promise<Client | null> {
    return await this.collection.findOne({ clave_cliente: clave_cliente });
  }

  async deleteByClaveClient(claveCliente: string): Promise<Client | null> {
    const result = await this.collection.findOneAndDelete({ claveCliente });

    if (!result) {
      return null; // No se encontró el cliente
    }
    return result;
  }

  // MÉTODO UPDATE - Solo actualiza campos con valores válidos
  async updateClient(client: Client): Promise<Client | null> {
    try {
      // Filtrar solo campos que no estén vacíos, null o undefined
      const updateFields: any = {
        updated_at: new Date() // Siempre actualizar timestamp
      };

      // Solo agregar campos si tienen valores válidos
      if (client.claveCliente != null && client.claveCliente.trim() !== '') {
        updateFields.claveCliente = client.claveCliente.trim();
      }

      if (client.nombre != null && client.nombre.trim() !== '') {
        updateFields.nombre = client.nombre.trim();
      }

      if (client.celular != null && client.celular.trim() !== '') {
        updateFields.celular = client.celular.trim();
      }

      if (client.email != null && client.email.trim() !== '') {
        updateFields.email = client.email.trim();
      }

      if (client.characterIcon != null) {
        updateFields.characterIcon = client.characterIcon;
      }

      updateFields.updatedAt = client.updatedAt;

      // Si no hay campos para actualizar (solo timestamp), no hacer nada
      if (Object.keys(updateFields).length === 1) {
        // Solo devolver el cliente existente sin cambios
        return await this.collection.findOne({ claveCliente: client.claveCliente });
      }

      const result = await this.collection.findOneAndUpdate(
        { claveCliente: client.claveCliente },
        { $set: updateFields },
        { 
          returnDocument: 'after',
          upsert: false
        }
      );

      return result;
    } catch (error: any) {
      if (error.code === 11000) {
        throw new Error('Cliente ya existe con esa clave o email');
      }
      throw error;
    }
  }

  async getPageClients(page: number): Promise<{ clients: Client[]; totalClients: number }> {
    const limit = 100
    const skip = (page - 1) * limit;
    const totalClients = await this.collection.countDocuments({});
    const ultimatePage = Math.ceil(totalClients / limit);
    // Calcular la penúltima página
    const penultimatePage = ultimatePage - 1;
    const totalToPenultimatePage = penultimatePage * limit;

    const totalClientsUltimatePage = totalClients - totalToPenultimatePage;
    
    const [clients, total] = await Promise.all([
      this.collection.find({}).skip(skip).limit(limit).toArray(),
      (page === ultimatePage) ? totalClientsUltimatePage : limit
    ]);

    return {
      clients: clients,
      totalClients: total
    };
  }

  async getTotalPages(): Promise<number> {
    try {
      const totalCount = await this.collection.countDocuments({});
      const limit = 100; // Número de documentos por página
      // Calcular total de páginas redondeado hacia arriba
      const totalPages = Math.ceil(totalCount / limit);
      return totalPages;
    } catch (error) {
      console.error('Error al obtener el total de páginas:', error);
      throw new Error('Error al obtener el total de páginas');
    }
  }
}