
import { PasswordEvaluateUseCase } from "@/src/Application/UseCases/Password/PasswordEvaluateUseCase";
import { Response, Request } from "express";

export class PasswordController {

    constructor(
        private readonly passwordEvaluateUseCase: PasswordEvaluateUseCase
    ) {}

    async evaluatePassword(req: Request, res: Response): Promise<void> {
        try {
            const { password } = req.body;



            res.status(200).json(
                await this.passwordEvaluateUseCase.execute({ password })
            );
        } catch (error) {
            console.error('Error evaluating password:', error);
            res.status(500).json({
                success: false,
                message: `Internal Server Error: ${error}`
            });
        }
    }
}