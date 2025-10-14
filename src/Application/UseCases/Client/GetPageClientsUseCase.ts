import { PageVO } from "src/Domain/ValueObjects/PageVO";
import { ClientRepository } from "../../../Domain/Repositories/ClientRepository";
import { GetPageClientesRequest } from "../../DTOs/GetPageClients/GetPageClientsRequest";
import { GetPageClientesResponse } from "../../DTOs/GetPageClients/GetPageClientsResponse";


export class GetPageClientsUseCase {
    constructor(
        private readonly clienteRepository: ClientRepository
    ) { }

    async execute(request: GetPageClientesRequest): Promise<GetPageClientesResponse> {
        // Validar datos de entrada usando Value Objects
        const totalPages = await this.clienteRepository.getTotalPages();
        const page = new PageVO(request.page, totalPages);

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