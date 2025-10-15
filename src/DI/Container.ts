
import { CreateClientUseCase } from "../Application/UseCases/Client/CreateClientUseCase";
import { DeleteClientUseCase } from "../Application/UseCases/Client/DeleteClientUseCase";
import { GetClientUseCase } from "../Application/UseCases/Client/GetClientUseCase";
import { GetPageClientsUseCase } from "../Application/UseCases/Client/GetPageClientsUseCase";
import { UpdateClientUseCase } from "../Application/UseCases/Client/UpdateClientUseCase";
import { PasswordEvaluateUseCase } from "../Application/UseCases/Password/PasswordEvaluateUseCase";
import { LoginUseCase } from "../Application/UseCases/User/LoginUserUseCase";
import { RegisterUseCase } from "../Application/UseCases/User/RegisterUserUseCase";
import { ImageRepository } from "../Domain/Repository/ImageRepository";
import { SecurityPasswordRepository } from "../Domain/Repository/SecurityPasswordRepository";
import { TokenRepository } from "../Domain/Repository/TokenRepository";
import { CloudinaryService } from "../Infrastructure/Cloudinary/CloudinaryService";
import { DatabaseConnection } from "../Infrastructure/Database/mongo/DatabaseConnection";
import { MongoClientRepository } from "../Infrastructure/Database/mongo/MongoClientRepository";
import { MongoUserRepository } from "../Infrastructure/Database/mongo/MongoUserRepository";
import { BcryptService } from "../Infrastructure/Services/BcryptService";
import { JwtTokenService } from "../Infrastructure/Services/JwtTokenService";
import { SecurityPasswordService } from "../Infrastructure/Services/SecurityPasswordService";
import { ClientController } from "../Presentation/Controllers/ClientController";
import { PasswordController } from "../Presentation/Controllers/PasswordController";
import { UserController } from "../Presentation/Controllers/UserController";
import { ClientRoutes } from "../Presentation/Routes/ClientRoutes";
import { PasswordRoutes } from "../Presentation/Routes/PasswordRoutes";
import { UserRoutes } from "../Presentation/Routes/UserRoutes";


export class Container {
  private static instance: Container;
  private databaseConnection: DatabaseConnection;
  // Repositories
  private userRepository: MongoUserRepository | null = null;
  private clientRepository: MongoClientRepository | null = null; // Assuming you have a similar repository for Cliente
  private securityPasswordRepository: SecurityPasswordRepository | null = null;

  // Use Cases
  private registerUseCase: RegisterUseCase | null = null;
  private loginUseCase: LoginUseCase | null = null;
  private createClientUseCase: CreateClientUseCase | null = null; // Assuming you have a use case for creating Client
  private updateClientUseCase: UpdateClientUseCase | null = null; // Assuming you have a use case for updating Cliente
  private getPageClientsUseCase: GetPageClientsUseCase | null = null; // Assuming you have a use case for getting paginated Clientes
  private getClientUseCase: GetClientUseCase | null = null; // Assuming you have a use case for getting a specific Cliente
  private deleteClientUseCase: DeleteClientUseCase | null = null;
  private passwordEvaluateUseCase: PasswordEvaluateUseCase | null = null;

  private userController: UserController | null = null;
  private userRoutes: UserRoutes | null = null;

  private clientsController: ClientController | null = null;
  private clientRoutes: ClientRoutes | null = null;

  private passwordController: PasswordController | null = null;
  private passwordRoutes: PasswordRoutes | null = null;

  // Services
  private encryptService: BcryptService | null = null;
  private tokenRepository: TokenRepository | null = null;

  private imageRepository: ImageRepository | null = null;

  private constructor() {
    this.databaseConnection = new DatabaseConnection();
  }

  static getInstance(): Container {
    if (!Container.instance) {
      Container.instance = new Container();
    }
    return Container.instance;
  }

  async initialize(
    connectionString: string, 
    databaseName: string, 
    secret: string, 
    cloud_name: string, 
    api_key: string, 
    api_secret: string,
    vulneablePasswords: string[]
  ): Promise<void> {
    const database = await this.databaseConnection.connect(connectionString, databaseName);
    this.imageRepository = new CloudinaryService(
      cloud_name,
      api_key,
      api_secret
    );

    // Services
    this.encryptService = new BcryptService();
    this.tokenRepository = new JwtTokenService(secret, 3900);

    // Repositories
    this.userRepository = new MongoUserRepository(database);
    this.clientRepository = new MongoClientRepository(database); // Assuming you have a similar repository for Cliente
    this.securityPasswordRepository = new SecurityPasswordService(
      vulneablePasswords
    )

    // Use Cases
    this.registerUseCase = new RegisterUseCase(this.userRepository, this.encryptService);
    this.loginUseCase = new LoginUseCase(this.userRepository, this.encryptService, this.tokenRepository);
    this.createClientUseCase = new CreateClientUseCase(
      this.clientRepository,
      this.imageRepository
    );
    this.updateClientUseCase = new UpdateClientUseCase(
      this.clientRepository,
      this.imageRepository
    );
    this.getPageClientsUseCase = new GetPageClientsUseCase(
      this.clientRepository
    );
    this.getClientUseCase = new GetClientUseCase(
      this.clientRepository
    );
    this.deleteClientUseCase = new DeleteClientUseCase(
      this.clientRepository,
      this.imageRepository
    );

    this.passwordEvaluateUseCase = new PasswordEvaluateUseCase(
      this.securityPasswordRepository
    );


    // Controllers
    this.userController = new UserController(
      this.registerUseCase,
      this.loginUseCase
    );
    this.clientsController = new ClientController(
      this.createClientUseCase,
      this.updateClientUseCase,
      this.getPageClientsUseCase,
      this.getClientUseCase,
      this.deleteClientUseCase
    );

    this.passwordController = new PasswordController(
      this.passwordEvaluateUseCase
    );

    // Routes
    this.userRoutes = new UserRoutes(this.userController);
    this.clientRoutes = new ClientRoutes(
      this.clientsController,
      this.tokenRepository
    );
    this.passwordRoutes = new PasswordRoutes(
      this.passwordController
    );
  }

  getUserRoutes(): UserRoutes {
    if (!this.userRoutes) {
      throw new Error('Container not initialized');
    }
    return this.userRoutes;
  }

  getClientRoutes(): ClientRoutes {
    if (!this.clientRoutes) {
      throw new Error('Container not initialized');
    }
    return this.clientRoutes;
  }

  getPasswordRoutes(): PasswordRoutes {
    if (!this.passwordRoutes) {
      throw new Error('Container not initialized');
    }
    return this.passwordRoutes;
  }

  async shutdown(): Promise<void> {
    await this.databaseConnection.disconnect();
  }
}