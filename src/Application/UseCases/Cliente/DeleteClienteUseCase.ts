import { ClientRepository } from "../../../Domain/Repositories/ClienteRepository";
import { DriveService } from "../../../Domain/Services/DriveService";
import { ClaveCliente } from "../../../Domain/ValueObjects/ClaveCliente";
import { DeleteClienteRequest } from "../../DTOs/DeleteCliente/DeleteClienteRequest";
import { DeleteClienteResponse } from "../../DTOs/DeleteCliente/DeleteClienteResponse";
import { ClienteNotExistsException } from "../../Exceptions/ClienteNotExistsException";


export class DeleteClienteUseCase {
    constructor(
        private readonly clienteRepository: ClientRepository,
        private readonly driveService: DriveService 
    ) { }

    async execute(request: DeleteClienteRequest): Promise<DeleteClienteResponse> {
        // Validar datos de entrada usando Value Objects
        const claveCliente = new ClaveCliente(request.claveCliente);

        // Obtener el cliente por clave_cliente
        const cliente = await this.clienteRepository.deleteByClaveClient(claveCliente.getValue());

        if (!cliente) {
            throw new ClienteNotExistsException(claveCliente.getValue());
        }

        // Si el cliente tiene un characterIcon, eliminarlo del servicio de Drive
        if (cliente.characterIcon && typeof cliente.characterIcon === 'object' && 'id' in cliente.characterIcon) {
            // Asumimos que characterIcon es un objeto con un id
            await this.driveService.deleteImageFromDrive(cliente.characterIcon.id);
        }

        // Retornar respuesta
        return {
            success: true,
            message: `Cliente con clave ${claveCliente.getValue()} eliminado correctamente.`,
        };
    }
}