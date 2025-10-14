import { ImageService } from "../../../Domain/Services/ImageService";
import { ClientRepository } from "../../../Domain/Repositories/ClientRepository";
import { UpdateClienteRequest } from "../../DTOs/UpdateClient/UpdateClientRequest";
import { UpdateClienteResponse } from "../../DTOs/UpdateClient/UpdateClientResponse";
import { ClienteNotExistsException } from "../../../Domain/Exceptions/Clients/ClienteNotExistsException";
import { InvalidCharacterIconException } from "../../../Domain/Exceptions/Clients/InvalidCharacterIconException";
import { ClientKeyVO } from "src/Domain/ValueObjects/ClientKeyVO";
import { CharacterIconVO } from "src/Domain/ValueObjects/CharacterIconVO";


export class UpdateClientUseCase {
    constructor(
        private readonly clientRepository: ClientRepository,
        private readonly imageService: ImageService
    ) { }

    async execute(request: UpdateClienteRequest): Promise<UpdateClienteResponse> {
        // Validar datos de entrada usando Value Objects
        const claveCliente = new ClientKeyVO(request.claveCliente);
        // Verificar que el cliente no exista
        const existingCliente = await this.clientRepository.findByClientKey(claveCliente.getValue());

        if (!existingCliente) {
            throw new ClienteNotExistsException(claveCliente.getValue());
        }

        if (request.characterIcon) {
            // Verificar que character_icon sea un file
            if (
                existingCliente.characterIcon &&
                typeof existingCliente.characterIcon === 'object' &&
                'id' in existingCliente.characterIcon
            ) {
                await this.imageService.deleteImage(existingCliente.characterIcon.id);
            }
            if (typeof request.characterIcon === 'string') {
                // Convertir a Number y que sea del 0 al 9 1 caracter
                const regexNumeric09 = /^[0-9]{1}$/;
                if (!regexNumeric09.test(request.characterIcon)) {
                    throw new InvalidCharacterIconException(request.characterIcon);
                }
                request.characterIcon = new CharacterIconVO(Number(request.characterIcon));
            } else if (typeof request.characterIcon === 'number') {
                if (request.characterIcon < 0 || request.characterIcon > 9) {
                    throw new InvalidCharacterIconException(request.characterIcon.toString());
                }
                request.characterIcon = new CharacterIconVO(request.characterIcon);
            } else {
                const { id, url } = await this.imageService.uploadImage(request.characterIcon, claveCliente.getValue());
                request.characterIcon = new CharacterIconVO({
                    id,
                    url
                });
            }
        }

        const clienteUpdated = await this.clientRepository.updateClient(
            clientKey: string, 
            name?: string | undefined, 
            phone?: string | undefined, 
            email?: string | undefined, 
            characterIcon?: string | undefined
        );

        if (!clienteUpdated) {
            throw new ClienteNotExistsException(claveCliente.getValue());
        }

        // Retornar respuesta
        return {
            success: true,
            message: `Cliente con clave ${claveCliente.getValue()} actualizado correctamente.`,
        }
    }
}