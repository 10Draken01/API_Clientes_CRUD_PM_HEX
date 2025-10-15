import { Db, Collection } from 'mongodb';
import { ClientRepository } from '../../../Domain/Repository/ClientRepository';
import { ClientEntity } from '../../../Domain/Entities/ClientEntity';


export class MongoClientRepository implements ClientRepository {
  private readonly collection: Collection<ClientEntity>;

  constructor(database: Db) {
    this.collection = database.collection<ClientEntity>('clients');
  }

  async createClient(client: ClientEntity): Promise<void> {
    try {
      await this.collection.insertOne(client);
    } catch (error: any) {
      if (error.code === 11000) {
        throw new Error('Client already exists.');
      }
      throw error;
    }
  }

  async findByClientKey(clientKey: string): Promise<ClientEntity | null> {
    return await this.collection.findOne({ clientKey: clientKey });
  }

  async deleteByClientKey(clientKey: string): Promise<ClientEntity | null> {
    const result = await this.collection.findOneAndDelete({ clientKey });

    if (!result) {
      return null; // No se encontró el cliente
    }
    return result;
  }

  // MÉTODO UPDATE - Solo actualiza campos con valores válidos
  async updateClient(clientKey: string, name?: string, phone?: string, email?: string, characterIcon?: string): Promise<ClientEntity | null> {
    try {
      // Filtrar solo campos que no estén vacíos, null o undefined
      const updateFields: any = {
        clientKey: clientKey,
        name: name,
        phone: phone,
        email: email,
        characterIcon: characterIcon,
        updated_at: new Date() // Siempre actualizar timestamp
      };

      // Si no hay campos para actualizar (solo timestamp), no hacer nada
      if (Object.keys(updateFields).length === 1) {
        // Solo devolver el cliente existente sin cambios
        return await this.collection.findOne({ clientKey: clientKey });
      }

      const result = await this.collection.findOneAndUpdate(
        { clientKey: clientKey },
        { $set: updateFields },
        { 
          returnDocument: 'after',
          upsert: false
        }
      );

      return result;
    } catch (error: any) {
      if (error.code === 11000) {
        throw new Error('Client already exists with key');
      }
      throw error;
    }
  }

  async getPageClients(page: number): Promise<{ clients: ClientEntity[]; totalClients: number }> {
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
      console.error('Error getting total pages:', error);
      throw new Error('Error getting total pages');
    }
  }
}