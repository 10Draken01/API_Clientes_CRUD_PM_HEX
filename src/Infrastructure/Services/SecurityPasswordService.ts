import { InvalidPasswordException } from "@/src/Domain/Exceptions/Users/InvalidPasswordException";
import { SecurityPasswordRepository } from "@/src/Domain/Repository/SecurityPasswordRepository";
import { PasswordVO } from "@/src/Domain/ValueObjects/PasswordVO";

export class SecurityPasswordService implements SecurityPasswordRepository {
    constructor(
        private readonly vulneablePasswords: string[]
    ) {}

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

        if (L != 0 && N != 0) {
            H = L * Math.log2(N);
        }

        const strength = this._assessStrength(H);
        const crackTime = this._estimateCrackTime(H);

        return new PasswordVO(password, H, L, N, strength, crackTime);
    }

    private _calculateLength(password: string): number {
        return password.length;
    }

    private _calculateWordSpaceSize(password: string): number {
        let N = 0;
        // Detectar minúsculas
        if (/[a-z]/.test(password)) {
            N += 26;
        }

        // Detectar mayúsculas
        if (/[A-Z]/.test(password)) {
            N += 26;
        }

        // Detectar dígitos
        if (/[0-9]/.test(password)) {
            N += 10;
        }

        // Detectar símbolos especiales
        if (/[!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]/.test(password)) {
            N += 32;
        }
        return N;
    }

    private _assessStrength(entropy: number): string {
        if (entropy < 28) {
            return "Muy débil";
        } else if (entropy < 36) {
            return "Débil";
        } else if (entropy < 60) {
            return "Aceptable";
        } else if (entropy < 128) {
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