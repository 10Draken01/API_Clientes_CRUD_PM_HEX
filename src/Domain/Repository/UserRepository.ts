import { UserEntity } from "../Entities/UserEntity";

export interface UserRepository {
  save(user: UserEntity): Promise<void>;
  findByEmail(email: string): Promise<UserEntity | null>;
}
