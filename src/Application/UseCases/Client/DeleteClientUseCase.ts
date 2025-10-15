import { ImageRepository } from "../../../Domain/Repository/ImageRepository";
import { ClientRepository } from "../../../Domain/Repository/ClientRepository";
import { ClientNotExistsException } from "../../../Domain/Exceptions/Clients/ClientNotExistsException";
import { DeleteClientRequest } from "../../DTOs/DeleteClient/DeleteClientRequest";
import { DeleteClientResponse } from "../../DTOs/DeleteClient/DeleteClientResponse";
import { ClientKeyVO } from "../../../Domain/ValueObjects/ClientKeyVO";


export class DeleteClientUseCase {
    constructor(
        private readonly clientRepository: ClientRepository,
        private readonly imageRepository: ImageRepository
    ) { }

    async execute(request: DeleteClientRequest): Promise<DeleteClientResponse> {
        // Validar datos de entrada usando Value Objects
        const clientKey = new ClientKeyVO(request.clientKey);

        // Obtener el cliente por clave_cliente
        const client = await this.clientRepository.deleteByClientKey(clientKey.getValue());

        if (!client) {
            throw new ClientNotExistsException(clientKey.getValue());
        }

        // Si el cliente tiene un characterIcon, eliminarlo del servicio de Drive
        if (client.characterIcon && typeof client.characterIcon === 'object' && 'id' in client.characterIcon) {
            // Asumimos que characterIcon es un objeto con un id
            await this.imageRepository.deleteImage(client.characterIcon.id);
        }

        // Retornar respuesta
        return {
            success: true,
            message: `Client with key ${clientKey.getValue()} deleted successfully.`,
        };
    }
}