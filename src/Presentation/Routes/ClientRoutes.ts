import { Router } from "express";
import { AuthMiddleware } from "../Middleware/Security/AuthMiddlewares";
import { ClientController } from "../Controllers/ClientController";
import { TokenRepository } from "@/src/Domain/Repository/TokenRepository";
import { uploadMiddleware } from "../Middleware/ImageService/ImageServiceValidationsMiddlewares";
import { validateCreateClient, validateGetClient, validateGetClients, validateUpdateClient } from "../Middleware/Clients/ClientsValidationsMiddlewares";


export class ClientRoutes {
  private router: Router;

  constructor(
    private readonly clientController: ClientController,
    private readonly tokenRepository: TokenRepository
  ) {
    this.router = Router();
    this.setupRoutes();
  }

  private setupRoutes(): void {
    const auth = AuthMiddleware(this.tokenRepository);

    this.router.post('/', auth, uploadMiddleware.single('characterIcon'), validateCreateClient, (req, res) => 
      this.clientController.createClient(req, res)
    );
    this.router.put('/:clientKey', auth, uploadMiddleware.single('characterIcon'), validateUpdateClient, (req, res) => 
      this.clientController.updateClient(req, res)
    );
    this.router.get('/page/:page', auth, validateGetClients, (req, res) => 
      this.clientController.getPageClients(req, res)
    );
    this.router.get('/:clientKey', auth, validateGetClient, (req, res) => 
      this.clientController.getClient(req, res)
    );
    this.router.delete('/:clientKey', auth, (req, res) => 
      this.clientController.deleteClient(req, res)
    );
  }

  getRouter(): Router {
    return this.router;
  }
}