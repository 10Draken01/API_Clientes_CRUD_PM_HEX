
import { ClientRepository } from "@/src/Domain/Repository/ClientRepository";
import { GetPageClientsRequest } from "../../DTOs/GetPageClients/GetPageClientsRequest";
import { GetPageClientsResponse } from "../../DTOs/GetPageClients/GetPageClientsResponse";
import { PageVO } from "@/src/Domain/ValueObjects/PageVO";



export class GetPageClientsUseCase {
    constructor(
        private readonly clientRepository: ClientRepository
    ) { }

    async execute(request: GetPageClientsRequest): Promise<GetPageClientsResponse> {
        // Validar datos de entrada usando Value Objects
        const totalPages = await this.clientRepository.getTotalPages();
        const page = new PageVO(request.page, totalPages);

        // Obtener la lista de clientes con paginación
        const { clients, totalClients } = await this.clientRepository.getPageClients(page.getValue());
        // Retornar respuesta
        return {
            success: true,
            message: `Page ${page.getValue()} retrieved successfully.`,
            clients,
            totalClients
        };
    }
}