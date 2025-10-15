import { ClientRepository } from "../../../Domain/Repository/ClientRepository";
import { GetClientResponse } from "../../DTOs/GetClient/GetClientResponse";
import { GetClientRequest } from "../../DTOs/GetClient/GetClientRequest";
import { ClientKeyVO } from "../../../Domain/ValueObjects/ClientKeyVO";
import { ClientNotExistsException } from "../../../Domain/Exceptions/Clients/ClientNotExistsException";



export class GetClientUseCase {
    constructor(
        private readonly clientRepository: ClientRepository
    ) { }

    async execute(request: GetClientRequest): Promise<GetClientResponse> {
        // Validar datos de entrada usando Value Objects
        const clientKey = new ClientKeyVO(request.clientKey);

        // Obtener el cliente por clientKey
        const client = await this.clientRepository.findByClientKey(clientKey.getValue());

        if (!client) {
            throw new ClientNotExistsException(clientKey.getValue());
        }
        // Retornar respuesta
        return {
            success: true,
            message: `Cliente con clave ${clientKey.getValue()} obtenido correctamente.`,
        };
    }
}