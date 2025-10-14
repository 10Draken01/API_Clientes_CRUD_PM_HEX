import { EncryptService } from "@/src/Domain/Services/EncryptService";
import { UserRepository } from "../../../Domain/Repositories/UserRepository";
import { TokenService } from "../../../Domain/Services/TokenService";
import { Email } from "../../../Domain/ValueObjects/EmailVO";
import { LoginRequest } from "../../DTOs/Login/LoginRequest";
import { LoginResponse } from "../../DTOs/Login/LoginResponse";
import { InvalidPasswordException } from "../../../Domain/Exceptions/InvalidPasswordException";
import { UserNotExistsException } from "../../../Domain/Exceptions/UserNotExistsException";


export class LoginUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly encryptService: EncryptService, // Asegúrate de inyectar un hasher de contraseñas
    private readonly tokenService: TokenService // Aquí deberías inyectar un servicio de generación de tokens JWT
  ) {}

  async execute(request: LoginRequest): Promise<LoginResponse> {
    // Validar datos de entrada usando Value Objects
    const email = new Email(request.email);

    // Verificar que el usuario no exista
    const existingUser = await this.userRepository.findByEmail(email.getValue());
    if (!existingUser) {
      throw new UserNotExistsException(email.getValue());
    }

    const passwordValidated = await this.encryptService.compare(request.password, existingUser.password);

    if (!passwordValidated) {
      throw new InvalidPasswordException('Contraseña incorrecta');
    }

    const tokenPayload = {
      _id: existingUser._id,
      username: existingUser.username,
      email: email.getValue(),
    }

    const token = await this.tokenService.generateToken(tokenPayload);

    // Retornar respuesta
    return {
      _id: existingUser._id,
      username: existingUser.username,
      email: email.getValue(),
      token: token, // Aquí deberías generar un token JWT
      expiresIn: 3600, // Por ejemplo, 1 hora
    };
  } 
}