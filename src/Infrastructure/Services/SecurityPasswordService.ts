import { InvalidPasswordException } from "@/src/Domain/Exceptions/Users/InvalidPasswordException";
import { SecurityPasswordRepository } from "@/src/Domain/Repository/SecurityPasswordRepository";
import { PasswordVO } from "@/src/Domain/ValueObjects/PasswordVO";

export class SecurityPasswordService implements SecurityPasswordRepository {
    constructor(
        private readonly vulneablePasswords: string[]
    ) { }

    evaluatePassword(password: string): PasswordVO {
        if (!password || password.trim().length < 8) {
            throw new InvalidPasswordException("Password must have at least 8 characters");
        }
        if (password.length > 128) {
            throw new InvalidPasswordException("Password must not exceed 128 characters");
        }

        if (this.vulneablePasswords.includes(password)) {
            throw new InvalidPasswordException("Password is too common or has been compromised");
        }

        // Aquí iría la lógica para evaluar la contraseña
        const L = this._calculateLength(password);
        const N = this._calculateWordSpaceSize(password);
        var H = 0;

        if (L != 0 && N >= 2) {
            H = L * Math.log2(N);
        }
        console.log(`Entropy (H): ${H}, Length (L): ${L}, Word Space Size (N): ${N}`);
        const strength = this._assessStrength(H);
        const crackTime = this._estimateCrackTime(H);

        return new PasswordVO(password, H, L, N, strength, crackTime);
    }

    private _calculateLength(password: string): number {
        return password.length;
    }

    private _calculateWordSpaceSize(password: string): number {
        const characterSet = {
            lowercase: /[a-z]/.test(password),
            uppercase: /[A-Z]/.test(password),
            digits: /[0-9]/.test(password),
            symbols: /[!@#$%^&*()_+\-=\[\]{};:'",.<>?/\\|`~\s]/.test(password),
        };

        let N = 0;
        if (characterSet.lowercase) N += 26;
        if (characterSet.uppercase) N += 26;
        if (characterSet.digits) N += 10;
        if (characterSet.symbols) N += 33; // Incluye espacio y otros símbolos
        return N;
    }

    private _assessStrength(entropy: number): string {
        if (entropy < 60) {
            return "Débil";
        } else if (entropy < 128) {
            return "Aceptable";
        } else if (entropy < 192) {
            return "Fuerte";
        } else {
            return "Muy fuerte";
        }
    }

    private _estimateCrackTime(entropy: number, attemptsPerSecond = 1011): { seconds: number; minutes: number; hours: number; days: number; years: number } {
        // Número total de combinaciones posibles
        const combinations = Math.pow(2, entropy);

        // Tiempo promedio = combinaciones / (2 × intentos_por_segundo)
        const seconds = combinations / (2 * attemptsPerSecond);
        

        return {
            seconds: seconds,
            minutes: seconds / 60,
            hours: seconds / 3600,
            days: seconds / 86400,
            years: seconds / (365.25 * 86400)
        };
    }
}