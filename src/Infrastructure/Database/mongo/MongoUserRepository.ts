import { Db, Collection } from 'mongodb';
import { UserRepository } from '../../../Domain/Repositories/UserRepository';
import { User } from '../../../Domain/Entities/User';

export class MongoUserRepository implements UserRepository {
  private readonly collection: Collection<User>;

  constructor(database: Db) {
    this.collection = database.collection<User>('users');
  }

  async save(user: User): Promise<void> {

    await this.collection.insertOne(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.collection.findOne({ email });
    
    if (!user) {
      return null;
    }

    return user;
  }
}
