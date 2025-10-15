import { SecurityPasswordRepository } from "@/src/Domain/Repository/SecurityPasswordRepository";
import { PasswordEvaluateRequest } from "../../DTOs/PasswordEvaluate/PasswordEvaluateRequest";
import { PasswordEvaluateResponse } from "../../DTOs/PasswordEvaluate/PasswordEvaluateResponse";


export class PasswordEvaluateUseCase {
    constructor(
        private readonly securityPasswordRepository: SecurityPasswordRepository
    ) {}

    async execute(request: PasswordEvaluateRequest): Promise<PasswordEvaluateResponse> {
        // Validar datos de entrada usando Value Objects
        const password = this.securityPasswordRepository.evaluatePassword(request.password);

        return {
            entropy: password.getEntropy(),
            length: password.getLength(),
            wordSpaceSize: password.getWordSpaceSize(),
            strength: password.getStrength(),
            crackTime: password.getCrackTime(),
        }
    }
}