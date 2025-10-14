import { Router } from "express";
import { ClienteController } from "../Controllers/ClientController";


export class ClientRoutes {
  private router: Router;

  constructor(
    private readonly clienteController: ClienteController,
    private readonly tokenService: TokenService
  ) {
    this.router = Router();
    this.setupRoutes();
  }

  private setupRoutes(): void {
    const auth = AuthMiddleware(this.tokenService);

    this.router.post('/', auth, uploadMiddleware.single('characterIcon'), validateCreateClient, (req, res) => 
      this.clienteController.createCliente(req, res)
    );
    this.router.put('/:claveCliente', auth, uploadMiddleware.single('characterIcon'), validateUpdateClient, (req, res) => 
      this.clienteController.updateCliente(req, res)
    );
    this.router.get('/page/:page', auth, validateGetClients, (req, res) => 
      this.clienteController.getPageClientes(req, res)
    );
    this.router.get('/:claveCliente', auth, validateGetClient, (req, res) => 
      this.clienteController.getCliente(req, res)
    );
    this.router.delete('/:claveCliente', auth, (req, res) => 
      this.clienteController.deleteCliente(req, res)
    );
  }

  getRouter(): Router {
    return this.router;
  }
}