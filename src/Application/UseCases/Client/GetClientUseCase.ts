
import { ClientKeyVO } from "src/Domain/ValueObjects/ClientKeyVO";
import { ClientRepository } from "../../../Domain/Repositories/ClientRepository";
import { GetClienteRequest } from "../../DTOs/GetCliente/GetClienteRequest";
import { GetClienteResponse } from "../../DTOs/GetCliente/GetClienteResponse";
import { ClienteNotExistsException } from "../../../Domain/Exceptions/Clients/ClienteNotExistsException";


export class GetClientUseCase {
    constructor(
        private readonly clienteRepository: ClientRepository
    ) { }

    async execute(request: GetClienteRequest): Promise<GetClienteResponse> {
        // Validar datos de entrada usando Value Objects
        const claveCliente = new ClientKeyVO(request.claveCliente);

        // Obtener el cliente por claveCliente
        const cliente = await this.clienteRepository.findByClientKey(claveCliente.getValue());

        if (!cliente) {
            throw new ClienteNotExistsException(claveCliente.getValue());
        }
        // Retornar respuesta
        return {
            success: true,
            message: `Cliente con clave ${claveCliente.getValue()} obtenido correctamente.`,
        };
    }
}