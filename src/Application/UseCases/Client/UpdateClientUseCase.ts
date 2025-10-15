import { ImageRepository } from "../../../Domain/Repository/ImageRepository";
import { ClientRepository } from "../../../Domain/Repository/ClientRepository";
import { UpdateClientRequest } from "../../DTOs/UpdateClient/UpdateClientRequest";
import { UpdateClientResponse } from "../../DTOs/UpdateClient/UpdateClientResponse";
import { ClientNotExistsException } from "../../../Domain/Exceptions/Clients/ClientNotExistsException";
import { InvalidCharacterIconException } from "../../../Domain/Exceptions/Clients/InvalidCharacterIconException";
import { ClientKeyVO } from "src/Domain/ValueObjects/ClientKeyVO";
import { CharacterIconVO } from "src/Domain/ValueObjects/CharacterIconVO";


export class UpdateClientUseCase {
    constructor(
        private readonly clientRepository: ClientRepository,
        private readonly imageRepository: ImageRepository
    ) { }

    async execute(request: UpdateClientRequest): Promise<UpdateClientResponse> {
        // Validar datos de entrada usando Value Objects
        const clientKey = new ClientKeyVO(request.clientKey);
        // Verificar que el cliente no exista
        const existingCliente = await this.clientRepository.findByClientKey(clientKey.getValue());

        if (!existingCliente) {
            throw new ClientNotExistsException(clientKey.getValue());
        }

        if (request.characterIcon) {
            // Verificar que character_icon sea un file
            if (
                existingCliente.characterIcon &&
                typeof existingCliente.characterIcon === 'object' &&
                'id' in existingCliente.characterIcon
            ) {
                await this.imageRepository.deleteImage(existingCliente.characterIcon.id);
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
                const { id, url } = await this.imageRepository.uploadImage(request.characterIcon, clientKey.getValue());
                request.characterIcon = new CharacterIconVO({
                    id,
                    url
                });
            }
        }

        const clienteUpdated = await this.clientRepository.updateClient(
            clientKey.getValue(),
            request.name,
            request.phone,
            request.email,
            request.characterIcon
        );

        if (!clienteUpdated) {
            throw new ClientNotExistsException(clientKey.getValue());
        }

        // Retornar respuesta
        return {
            success: true,
            message: `Client with key ${clientKey.getValue()} updated successfully.`,
        }
    }
}