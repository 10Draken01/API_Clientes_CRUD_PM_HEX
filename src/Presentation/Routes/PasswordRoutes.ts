import { Router } from "express";
import { PasswordController } from "../Controllers/PasswordController";


export class PasswordRoutes {
  private router: Router;

  constructor(
    private readonly passwordController: PasswordController
  ) {
    this.router = Router();
    this.setupRoutes();
  }

  private setupRoutes(): void {

    this.router.post('/evaluate', (req, res) => 
      this.passwordController.evaluatePassword(req, res)
    );
  }

  getRouter(): Router {
    return this.router;
  }
}