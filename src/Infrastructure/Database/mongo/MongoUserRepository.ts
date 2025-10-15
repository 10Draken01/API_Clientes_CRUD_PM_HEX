import { Db, Collection } from 'mongodb';
import { UserRepository } from '../../../Domain/Repository/UserRepository';
import { UserEntity } from '../../../Domain/Entities/UserEntity';

export class MongoUserRepository implements UserRepository {
  private readonly collection: Collection<UserEntity>;

  constructor(database: Db) {
    this.collection = database.collection<UserEntity>('users');
  }

  async save(user: UserEntity): Promise<void> {
    await this.collection.insertOne(user);
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.collection.findOne({ email });
    
    if (!user) {
      return null;
    }

    return user;
  }
}
