import { ClientRepository } from "../../../Domain/Repositories/ClienteRepository";
import { Page } from "../../../Domain/ValueObjects/Page";
import { GetPageClientesRequest } from "../../DTOs/GetPageClientes/GetPageClientesRequest";
import { GetPageClientesResponse } from "../../DTOs/GetPageClientes/GetPageClientesResponse";


export class GetPageClientesUseCase {
    constructor(
        private readonly clienteRepository: ClientRepository
    ) { }

    async execute(request: GetPageClientesRequest): Promise<GetPageClientesResponse> {
        // Validar datos de entrada usando Value Objects
        const totalPages = await this.clienteRepository.getTotalPages();
        const page = new Page(request.page, totalPages);

        // Obtener la lista de clientes con paginación
        const { clients, totalClients } = await this.clienteRepository.getPageClients(page.getValue());
        // Retornar respuesta
        return {
            success: true,
            message: `Página ${page.getValue()} de clientes obtenida correctamente.`,
            clients: clients,
            totalClients: totalClients,
        };
    }
}