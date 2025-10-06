import { ImageService } from "../../../Domain/Services/ImageService";
import { ClientRepository } from "../../../Domain/Repositories/ClientRepository";
import { Celular } from "../../../Domain/ValueObjects/Celular";
import { CharacterIcon } from "../../../Domain/ValueObjects/CharacterIcon";
import { ClaveCliente } from "../../../Domain/ValueObjects/ClaveCliente";
import { Email } from "../../../Domain/ValueObjects/Email";
import { Nombre } from "../../../Domain/ValueObjects/Nombre";
import { Id } from "../../../Domain/ValueObjects/UserId";
import { CreateClienteRequest } from "../../DTOs/CreateCliente/CreateClienteRequest";
import { CreateClienteResponse } from "../../DTOs/CreateCliente/CreateClienteResponse";
import { ClienteAlreadyExistsException } from "../../Exceptions/ClienteAlreadyExistsException";
import { InvalidCharacterIconException } from "../../Exceptions/InvalidCharacterIconException";
import { CharacterIcontype } from "@/src/Domain/Entities/CharacterIcontype";

export class CreateClienteUseCase {
  constructor(
    private readonly clienteRepository: ClientRepository,
    private readonly imageService: ImageService
  ) {}

  async execute(request: CreateClienteRequest): Promise<CreateClienteResponse> {
    // Validaciones de dominio
    const id = new Id();
    const claveCliente = new ClaveCliente(request.claveCliente);
    const nombre = new Nombre(request.nombre);
    const celular = new Celular(request.celular);
    const email = new Email(request.email);

    // Verificar duplicado
    const existingCliente = await this.clienteRepository.findByClaveClient(claveCliente.getValue());
    if (existingCliente) {
      throw new ClienteAlreadyExistsException(claveCliente.getValue());
    }

    let characterIcon: CharacterIcontype | number = 0;

    // Subir imagen si se incluye un archivo en el request
    if (request.characterIcon && typeof request.characterIcon === 'object' && 'buffer' in request.characterIcon) {
      const file = request.characterIcon as Express.Multer.File;
      const { id: imgId, url }: CharacterIcontype = await this.imageService.uploadImage(
        file,
        claveCliente.getValue()
      );
      characterIcon = { id: imgId, url };
    } else if (typeof request.characterIcon === 'number') {
      characterIcon = request.characterIcon;
    } else {
      throw new InvalidCharacterIconException('El valor de characterIcon debe ser un archivo (buffer) o un número válido.');
    }

    const date = new Date();

    await this.clienteRepository.createClient({
      _id: id.getValue(),
      claveCliente: claveCliente.getValue(),
      nombre: nombre.getValue(),
      celular: celular.getValue(),
      email: email.getValue(),
      characterIcon,
      createdAt: date,
      updatedAt: date,
    });

    return {
      success: true,
      message: 'Cliente creado exitosamente',
    };
  }
}
