import { PasswordVO } from "../ValueObjects/PasswordVO";

export interface SecurityPasswordRepository {
    evaluatePassword(password: string): PasswordVO;
}