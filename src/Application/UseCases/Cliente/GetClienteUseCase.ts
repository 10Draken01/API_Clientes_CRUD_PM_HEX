import { ClientRepository } from "../../../Domain/Repositories/ClientRepository";
import { ClaveCliente } from "../../../Domain/ValueObjects/ClaveCliente";
import { GetClienteRequest } from "../../DTOs/GetCliente/GetClienteRequest";
import { GetClienteResponse } from "../../DTOs/GetCliente/GetClienteResponse";
import { ClienteNotExistsException } from "../../Exceptions/ClienteNotExistsException";


export class GetClienteUseCase {
    constructor(
        private readonly clienteRepository: ClientRepository
    ) { }

    async execute(request: GetClienteRequest): Promise<GetClienteResponse> {
        // Validar datos de entrada usando Value Objects
        const claveCliente = new ClaveCliente(request.claveCliente);

        // Obtener el cliente por claveCliente
        const cliente = await this.clienteRepository.findByClaveClient(claveCliente.getValue());

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