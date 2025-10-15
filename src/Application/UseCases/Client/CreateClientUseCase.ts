import { ImageRepository } from "../../../Domain/Repository/ImageRepository";
import { ClientRepository } from "../../../Domain/Repository/ClientRepository";
import { ClienteAlreadyExistsException } from "../../../Domain/Exceptions/Clients/ClientAlreadyExistsException";
import { CreateClientRequest } from "../../DTOs/CreateClient/CreateClientRequest";
import { CreateClientResponse } from "../../DTOs/CreateClient/CreateClientResponse";
import { ClientKeyVO } from "../../../Domain/ValueObjects/ClientKeyVO";
import { NameVO } from "../../../Domain/ValueObjects/NameVO";
import { PhoneVO } from "../../../Domain/ValueObjects/PhoneVO";
import { EmailVO } from "../../../Domain/ValueObjects/EmailVO";
import { IdVO } from "../../../Domain/ValueObjects/IdVO";
import { CharacterIconVO } from "../../../Domain/ValueObjects/CharacterIconVO";
import { ClientEntity } from "src/Domain/Entities/ClientEntity";

export class CreateClientUseCase {
  constructor(
    private readonly clienteRepository: ClientRepository,
    private readonly imageRepository: ImageRepository
  ) {}

  async execute(request: CreateClientRequest): Promise<CreateClientResponse> {
    // Validaciones de dominio
    const id = new IdVO();
    const clientKey = new ClientKeyVO(request.clientKey);
    const name = new NameVO(request.name);
    const phone = new PhoneVO(request.phone);
    const email = new EmailVO(request.email);

    // Verificar duplicado
    const existingClient = await this.clienteRepository.findByClientKey(clientKey.getValue());
    if (existingClient) {
      throw new ClienteAlreadyExistsException(clientKey.getValue());
    }

    let characterIcon: CharacterIconVO =  new CharacterIconVO(request.characterIcon); // Valor por defecto

    // Subir imagen si se incluye un archivo en el request
    if (characterIcon.type === 'File') {
      const file = characterIcon.getValue() as Express.Multer.File;
      const { id, url } = await this.imageRepository.uploadImage(
        file,
        clientKey.getValue()
      );
      characterIcon = new CharacterIconVO({ id, url });
    }

    const date = new Date();

    const newClient: ClientEntity = {
      _id: id.getValue(),
      clientKey: clientKey.getValue(),
      name: name.getValue(),
      phone: phone.getValue(),
      email: email.getValue(),
      characterIcon: characterIcon.getValue(),
      createdAt: date,
      updatedAt: date,
    }

    await this.clienteRepository.createClient(newClient);

    return {
      success: true,
      message: 'Client created successfully',
    };
  }
}
