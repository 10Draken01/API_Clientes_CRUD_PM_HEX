import { request, Request, Response } from 'express';
import { CreateClienteUseCase } from '../../Application/UseCases/Cliente/CreateClienteUseCase';
import { CreateClienteRequest } from '../../Application/DTOs/CreateCliente/CreateClienteRequest';
import { ClienteAlreadyExistsException } from '../../Application/Exceptions/ClienteAlreadyExistsException';
import { UpdateClienteUseCase } from '../../Application/UseCases/Cliente/UpdateClienteUseCase';
import { GetPageClientesUseCase } from '../../Application/UseCases/Cliente/GetPageClientesUseCase';
import { InvalidPageException } from '../../Application/Exceptions/InvalidPageException';
import { GetClienteUseCase } from '../../Application/UseCases/Cliente/GetClienteUseCase';
import { ClienteNotExistsException } from '../../Application/Exceptions/ClienteNotExistsException';
import { DeleteClienteUseCase } from '../../Application/UseCases/Cliente/DeleteClienteUseCase';
import { InexistPagesException } from '../../Application/Exceptions/InexistPagesException';
import { InvalidEmailError } from '../../Application/Exceptions/InvalidEmailError';

export class ClienteController {
  constructor(
    private readonly createClienteUseCase: CreateClienteUseCase,
    private readonly updateClienteUseCase: UpdateClienteUseCase, // Asumiendo que el mismo caso de uso maneja creación y actualización
    private readonly getPageClientesUseCase: GetPageClientesUseCase, // Asumiendo que tienes un caso de uso para obtener la página de clientes
    private readonly getClienteUseCase: GetClienteUseCase, // Asumiendo que tienes un caso de uso para obtener un cliente específico
    private readonly deleteClienteUseCase: DeleteClienteUseCase
  ) { }

  async createCliente(req: Request, res: Response): Promise<void> {
    try {

      const characterIcon = req.file ?? req.body.characterIcon;

      const request: CreateClienteRequest = {
        claveCliente: req.body.claveCliente,
        nombre: req.body.nombre,
        celular: req.body.celular,
        email: req.body.email,
        characterIcon: characterIcon, // Asumiendo que characterIcon puede ser un archivo o un número
      };

      if (req.file) {
        console.log(`Archivo recibido: ${req.file.originalname} (${req.file.mimetype}, ${req.file.size} bytes)`);
      }

      res.status(200).json(
        await this.createClienteUseCase.execute(request)
      );
    } catch (error) {
      console.error('Error al crear cliente:', error);
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

  async updateCliente(req: Request, res: Response): Promise<void> {
    try {
      const characterIcon = req.file ?? req.body.characterIcon;

      const request: CreateClienteRequest = {
        claveCliente: req.params.clave_cliente, // Asumiendo que la clave del cliente se pasa como parámetro de ruta
        nombre: req.body.nombre,
        celular: req.body.celular,
        email: req.body.email,
        characterIcon: characterIcon,
      };

      if (req.file) {
        console.log(`Archivo recibido: ${req.file.originalname} (${req.file.mimetype}, ${req.file.size} bytes)`);
      }

      res.status(200).json(
        await this.updateClienteUseCase.execute(request)
      );
    } catch (error) {
      console.error('Error al actualizar cliente:', error);

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

  async getPageClientes (req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.params.page as string) || 1; // Obtener el número de página desde la query, por defecto 1

      res.status(200).json(
        await this.getPageClientesUseCase.execute({ page })
      );
    } catch (error) {
      console.error('Error al obtener página de clientes:', error);

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

  async getCliente(req: Request, res: Response): Promise<void> {
    try {
      const claveCliente = req.params.claveCliente; // Asumiendo que la clave del cliente se pasa como parámetro de ruta

      res.status(200).json(
        await this.getClienteUseCase.execute({ claveCliente })
      );
    } catch (error) {
      console.error('Error al obtener cliente:', error);

      if (error instanceof ClienteNotExistsException) {
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

  async deleteCliente(req: Request, res: Response): Promise<void> {
    try{
      const claveCliente = req.params.claveCliente; 


      res.status(200).json(
        await this.deleteClienteUseCase.execute({ claveCliente })
      );
    } catch (error) {
      console.error('Error al obtener cliente:', error);

      if (error instanceof ClienteNotExistsException) {
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