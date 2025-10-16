import { Router } from "express";
import { PasswordController } from "../Controllers/PasswordController";

/**
 * @swagger
 * tags:
 *   - name: Seguridad
 *     description: Endpoints relacionados con validación de seguridad (sin autenticación)
 */

/**
 * @swagger
 * /api/v1/password/evaluate:
 *   post:
 *     summary: Evaluar fortaleza de contraseña
 *     description: Analiza la seguridad de una contraseña y retorna su nivel de fortaleza, entropía y tiempo estimado para crackearla.
 *     tags:
 *       - Seguridad
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *             properties:
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "MyStr0ng!P@ssw0rd123"
 *                 description: Contraseña a evaluar (8-128 caracteres)
 *     responses:
 *       200:
 *         description: Evaluación de contraseña completada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 entropy:
 *                   type: number
 *                   example: 92.5
 *                   description: Entropía en bits (medida de aleatoriedad y fortaleza)
 *                 length:
 *                   type: number
 *                   example: 20
 *                   description: Longitud de la contraseña
 *                 wordSpaceSize:
 *                   type: number
 *                   example: 94
 *                   description: Número total de caracteres posibles utilizados
 *                 strength:
 *                   type: string
 *                   enum: ["Muy débil", "Débil", "Aceptable", "Fuerte", "Muy fuerte"]
 *                   example: "Muy fuerte"
 *                   description: Nivel de fortaleza de la contraseña
 *                 crackTime:
 *                   type: object
 *                   description: Tiempo estimado para crackear la contraseña con 10^11 intentos/segundo
 *                   properties:
 *                     seconds:
 *                       type: number
 *                       example: 123456789.0
 *                     minutes:
 *                       type: number
 *                       example: 2057614.8
 *                     hours:
 *                       type: number
 *                       example: 34293.6
 *                     days:
 *                       type: number
 *                       example: 1428.9
 *                     years:
 *                       type: number
 *                       example: 3.9
 *       400:
 *         description: Contraseña inválida
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   enum:
 *                     - "Password must have at least 8 characters"
 *                     - "Password must not exceed 128 characters"
 *                     - "Password is too common or has been compromised"
 *                   example: "Password must have at least 8 characters"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error: Error evaluating password"
 */

export class PasswordRoutes {
  private router: Router;

  constructor(
    private readonly passwordController: PasswordController
  ) {
    this.router = Router();
    this.setupRoutes();
  }

  private setupRoutes(): void {
    this.router.post('/evaluate', (req, res) => 
      this.passwordController.evaluatePassword(req, res)
    );
  }

  getRouter(): Router {
    return this.router;
  }
}