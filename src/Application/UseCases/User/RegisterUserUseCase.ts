import { User } from "../../../Domain/Entities/UserEntity";
import { UserRepository } from "../../../Domain/Repositories/UserRepository";
import { EncryptService } from "../../../Domain/Services/EncryptService";
import { Email } from "../../../Domain/ValueObjects/EmailVO";
import { Password } from "../../../Domain/ValueObjects/PasswordVO";
import { Id } from "../../../Domain/ValueObjects/IdVO";
import { Username } from "../../../Domain/ValueObjects/UsernameVO";
import { RegisterRequest } from "../../DTOs/Register/RegisterRequest";
import { RegisterResponse } from "../../DTOs/Register/RegisterResponse";
import { UserAlreadyExistsException } from "../../../Domain/Exceptions/UserAlreadyExistsException";


export class RegisterUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly encryptService: EncryptService // Asegúrate de inyectar un hasher de contraseñas
  ) {}

  async execute(request: RegisterRequest): Promise<RegisterResponse> {
    // Validar datos de entrada usando Value Objects
    const userId = new Id();
    const username = new Username(request.username);
    const email = new Email(request.email);
    const password = new Password(request.password); // En un caso real, deberías hashear la contraseña

    // Hashear la contraseña antes de guardarla
    const hashedPassword = await this.encryptService.hash(password.getValue());
    password.setHashedPassword(hashedPassword); // Actualizar el objeto Password con el hash

    // Verificar que el usuario no exista
    const existingUser = await this.userRepository.findByEmail(email.getValue());
    if (existingUser) {
      throw new UserAlreadyExistsException(email.getValue());
    }

    // Crear el usuario
    const user: User = {
      _id: userId.getValue(),
      username: username.getValue(),
      email: email.getValue(),
      password: password.getValue(), // En un caso real, deberías hashear la contraseña
    };

    // Guardar el usuario
    await this.userRepository.save(user);

    // Retornar respuesta
    return user;
  }
}