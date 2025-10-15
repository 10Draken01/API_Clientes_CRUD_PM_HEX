import { CreateClientRequest } from "@/src/Application/DTOs/CreateClient/CreateClientRequest";
import { CreateClientUseCase } from "@/src/Application/UseCases/Client/CreateClientUseCase";
import { DeleteClientUseCase } from "@/src/Application/UseCases/Client/DeleteClientUseCase";
import { GetClientUseCase } from "@/src/Application/UseCases/Client/GetClientUseCase";
import { GetPageClientsUseCase } from "@/src/Application/UseCases/Client/GetPageClientsUseCase";
import { UpdateClientUseCase } from "@/src/Application/UseCases/Client/UpdateClientUseCase";
import { ClienteAlreadyExistsException } from "@/src/Domain/Exceptions/Clients/ClientAlreadyExistsException";
import { ClientNotExistsException } from "@/src/Domain/Exceptions/Clients/ClientNotExistsException";
import { InexistPagesException } from "@/src/Domain/Exceptions/Clients/InexistPagesException";
import { InvalidPageException } from "@/src/Domain/Exceptions/Clients/InvalidPageException";
import { InvalidEmailError } from "@/src/Domain/Exceptions/Users/InvalidEmailError";
import { Response, Request } from "express";


export class ClientController {
  constructor(
    private readonly createClientUseCase: CreateClientUseCase,
    private readonly updateClientUseCase: UpdateClientUseCase, // Asumiendo que el mismo caso de uso maneja creación y actualización
    private readonly getPageClientsUseCase: GetPageClientsUseCase, // Asumiendo que tienes un caso de uso para obtener la página de clientes
    private readonly getClientUseCase: GetClientUseCase, // Asumiendo que tienes un caso de uso para obtener un cliente específico
    private readonly deleteClientUseCase: DeleteClientUseCase
  ) { }

  async createClient(req: Request, res: Response): Promise<void> {
    try {

      const characterIcon = req.file ?? req.body.characterIcon;

      const request: CreateClientRequest = {
        clientKey: req.body.clientKey,
        name: req.body.name,
        phone: req.body.phone,
        email: req.body.email,
        characterIcon: characterIcon, // Asumiendo que characterIcon puede ser un archivo o un número
      };

      if (req.file) {
        console.log(`File received: ${req.file.originalname} (${req.file.mimetype}, ${req.file.size} bytes)`);
      }

      res.status(200).json(
        await this.createClientUseCase.execute(request)
      );
    } catch (error) {
      console.error('Error creating client:', error);
      if (error instanceof InvalidEmailError) {
        res.status(400).json({
          success: false,
          message: `Bad Request: ${error.message}`,
        });
        return;
      }

      if (error instanceof ClienteAlreadyExistsException) {
        res.status(409).json({
          success: false,
          message: `Conflict: ${error.message}`,
        });
        return;
      }

      if (error instanceof Error) {
        res.status(400).json({
          success: false,
          message: `Bad Request: ${error.message}`,
        });
        return;
      }

      res.status(500).json({
        success: false,
        message: 'Internal Server Error: An unexpected error occurred',
      });
    }
  }

  async updateClient(req: Request, res: Response): Promise<void> {
    try {
      const characterIcon = req.file ?? req.body.characterIcon;

      const request: CreateClientRequest = {
        clientKey: req.params.clientKey, // Asumiendo que la clave del cliente se pasa como parámetro de ruta
        name: req.body.name,
        phone: req.body.phone,
        email: req.body.email,
        characterIcon: characterIcon,
      };

      if (req.file) {
        console.log(`File received: ${req.file.originalname} (${req.file.mimetype}, ${req.file.size} bytes)`);
      }

      res.status(200).json(
        await this.updateClientUseCase.execute(request)
      );
    } catch (error) {
      console.error('Error updating client:', error);

      if (error instanceof ClienteAlreadyExistsException) {
        res.status(409).json({
          success: false,
          message: `Conflict: ${error.message}`,
        });
        return;
      }

      if (error instanceof Error) {
        res.status(400).json({
          success: false,
          message: `Bad Request: ${error.message}`,
        });
        return;
      }

      res.status(500).json({
        success: false,
        message: 'Internal Server Error: An unexpected error occurred',
      });
    }
  }

  async getPageClients (req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.params.page as string) || 1; // Obtener el número de página desde la query, por defecto 1

      res.status(200).json(
        await this.getPageClientsUseCase.execute({ page })
      );
    } catch (error) {
      console.error('Error getting page of clients:', error);

      if( error instanceof InexistPagesException) {
        res.status(404).json({
          success: false,
          message: `Not Found: ${error.message}`,
        });
        return;
      }

      if (error instanceof InvalidPageException) {
        res.status(400).json({
          success: false,
          message: `Invalid Page: ${error.message}`,
        });
        return;
      }
      if (error instanceof Error) {

        res.status(500).json({
          success: false,
          message: 'Internal Server Error: An unexpected error occurred',
        });
      }
    }
  }

  async getClient(req: Request, res: Response): Promise<void> {
    try {
      const clientKey = req.params.clientKey; // Asumiendo que la clave del cliente se pasa como parámetro de ruta

      res.status(200).json(
        await this.getClientUseCase.execute({ clientKey })
      );
    } catch (error) {
      console.error('Error getting client:', error);

      if (error instanceof ClientNotExistsException) {
        res.status(404).json({
          success: false,
          message: `Not Found: ${error.message}`,
        });
        return;
      }

      res.status(500).json({
        success: false,
        message: 'Internal Server Error: An unexpected error occurred',
      });
    }
  }

  async deleteClient(req: Request, res: Response): Promise<void> {
    try {
      const clientKey = req.params.clientKey; // Asumiendo que la clave del cliente se pasa como parámetro de ruta

      res.status(200).json(
        await this.deleteClientUseCase.execute({ clientKey })
      );
    } catch (error) {
      console.error('Error getting client:', error);

      if (error instanceof ClientNotExistsException) {
        res.status(404).json({
          success: false,
          message: `Not Found: ${error.message}`,
        });
        return;
      }

      res.status(500).json({
        success: false,
        message: 'Internal Server Error: An unexpected error occurred',
      });
    }
  }
}