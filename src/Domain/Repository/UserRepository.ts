import { InsertOneResult } from "mongodb";
import { User } from "../Entities/UserEntity";

export interface UserRepository {
  save(user: User): Promise<void>;
  findByEmail(email: string): Promise<User | null>;
}
