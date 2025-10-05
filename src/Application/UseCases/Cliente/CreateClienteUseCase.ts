import { ClientRepository } from "../../../Domain/Repositories/ClienteRepository";
import { DriveService } from "../../../Domain/Services/DriveService";
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


export class CreateClienteUseCase {
    constructor(
        private readonly clienteRepository: ClientRepository,
        private readonly driveService: DriveService 
    ) { }

    async execute(request: CreateClienteRequest): Promise<CreateClienteResponse> {
        // Validar datos de entrada usando Value Objects
        const id = new Id()
        const claveCliente = new ClaveCliente(request.claveCliente);
        const nombre = new Nombre(request.nombre);
        const celular = new Celular(request.celular); // Asumimos que el celular es
        const email = new Email(request.email);

        // Verificar que el cliente no exista
        const existingCliente = await this.clienteRepository.findByClaveClient(claveCliente.getValue());

        if (existingCliente) {
            throw new ClienteAlreadyExistsException(claveCliente.getValue());
        }

        // Verificar que character_icon sea un file
        let characterIcon: CharacterIcon = new CharacterIcon(0); // Valor por defecto
        // Verificar que character_icon sea un file
        if (typeof request.characterIcon === 'string') {
            // Convertir a Number y que sea del 0 al 9 1 caracter
            const regexNumeric09 = /^[0-9]{1}$/;
            if (!regexNumeric09.test(request.characterIcon)) {
                throw new InvalidCharacterIconException(request.characterIcon);
            }
            request.characterIcon = new CharacterIcon(Number(request.characterIcon));
        } else if (typeof request.characterIcon === 'number') {
            if (request.characterIcon < 0 || request.characterIcon > 9) {
                throw new InvalidCharacterIconException(request.characterIcon.toString());
            }
            characterIcon = new CharacterIcon(request.characterIcon);
        } else {
            const { fileId, imageUrl } = await this.driveService.uploadImageToDrive(request.characterIcon, claveCliente.getValue());
            characterIcon = new CharacterIcon({
                id: fileId,
                url: imageUrl
            });
        }

        const date = new Date();

        await this.clienteRepository.createClient({
            _id: id.getValue(), // Generar un ID único
            claveCliente: claveCliente.getValue(),
            nombre: nombre.getValue(),
            celular: celular.getValue(),
            email: email.getValue(),
            characterIcon: characterIcon.getValue(), // Asumimos que es un número o string
            createdAt: date, // Fecha de creación
            updatedAt: date, // Fecha de actualización
        });

        // Retornar respuesta
        return {
            success: true,
            message: 'Cliente creado exitosamente',
        };
    }
}