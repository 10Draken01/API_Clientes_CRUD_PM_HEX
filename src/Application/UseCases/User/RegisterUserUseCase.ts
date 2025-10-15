import { UserEntity } from "../../../Domain/Entities/UserEntity";
import { UserRepository } from "../../../Domain/Repository/UserRepository";
import { EncryptRepository } from "../../../Domain/Repository/EncryptRepository";
import { EmailVO } from "../../../Domain/ValueObjects/EmailVO";
import { PasswordVO } from "../../../Domain/ValueObjects/PasswordVO";
import { IdVO } from "../../../Domain/ValueObjects/IdVO";
import { UsernameVO } from "../../../Domain/ValueObjects/UsernameVO";
import { RegisterRequest } from "../../DTOs/Register/RegisterRequest";
import { RegisterResponse } from "../../DTOs/Register/RegisterResponse";
import { UserAlreadyExistsException } from "../../../Domain/Exceptions/Users/UserAlreadyExistsException";


export class RegisterUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly encryptRepository: EncryptRepository // Asegúrate de inyectar un hasher de contraseñas
  ) {}

  async execute(request: RegisterRequest): Promise<RegisterResponse> {
    // Validar datos de entrada usando Value Objects
    const userId = new IdVO();
    const username = new UsernameVO(request.username);
    const email = new EmailVO(request.email);
    const password = new PasswordVO(request.password); // En un caso real, deberías hashear la contraseña

    // Hashear la contraseña antes de guardarla
    const hashedPassword = await this.encryptRepository.hash(password.getValue());
    password.setHashedPassword(hashedPassword); // Actualizar el objeto Password con el hash

    // Verificar que el usuario no exista
    const existingUser = await this.userRepository.findByEmail(email.getValue());
    if (existingUser) {
      throw new UserAlreadyExistsException(email.getValue());
    }

    // Crear el usuario
    const user: UserEntity = {
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