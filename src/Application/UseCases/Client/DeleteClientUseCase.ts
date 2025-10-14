import { ImageService } from "../../../Domain/Services/ImageService";
import { ClientRepository } from "../../../Domain/Repositories/ClientRepository";
import { ClienteNotExistsException } from "../../../Domain/Exceptions/Clients/ClienteNotExistsException";
import { DeleteClientRequest } from "../../DTOs/DeleteClient/DeleteClientRequest";
import { DeleteClientResponse } from "../../DTOs/DeleteClient/DeleteClientResponse";
import { ClientKeyVO } from "../../../Domain/ValueObjects/ClientKeyVO";


export class DeleteClientUseCase {
    constructor(
        private readonly clienteRepository: ClientRepository,
        private readonly imageService: ImageService
    ) { }

    async execute(request: DeleteClientRequest): Promise<DeleteClientResponse> {
        // Validar datos de entrada usando Value Objects
        const clientKey = new ClientKeyVO(request.clientKey);

        // Obtener el cliente por clave_cliente
        const cliente = await this.clienteRepository.deleteByClientKey(clientKey.getValue());

        if (!cliente) {
            throw new ClienteNotExistsException(clientKey.getValue());
        }

        // Si el cliente tiene un characterIcon, eliminarlo del servicio de Drive
        if (cliente.characterIcon && typeof cliente.characterIcon === 'object' && 'id' in cliente.characterIcon) {
            // Asumimos que characterIcon es un objeto con un id
            await this.imageService.deleteImage(cliente.characterIcon.id);
        }

        // Retornar respuesta
        return {
            success: true,
            message: `Client with key ${clientKey.getValue()} deleted successfully.`,
        };
    }
}