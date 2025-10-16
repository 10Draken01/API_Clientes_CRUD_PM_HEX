import { Router } from "express";
import { AuthMiddleware } from "../Middleware/Security/AuthMiddlewares";
import { ClientController } from "../Controllers/ClientController";
import { TokenRepository } from "@/src/Domain/Repository/TokenRepository";
import { uploadMiddleware } from "../Middleware/ImageService/ImageServiceValidationsMiddlewares";
import { validateCreateClient, validateGetClient, validateGetClients, validateUpdateClient } from "../Middleware/Clients/ClientsValidationsMiddlewares";

/**
 * @swagger
 * tags:
 *   - name: Clientes
 *     description: Endpoints para gestión de clientes (CRUD). Todas las operaciones requieren autenticación JWT.
 */

/**
 * @swagger
 * /api/clients:
 *   post:
 *     summary: Crear un nuevo cliente
 *     description: Crea un nuevo cliente con su imagen de perfil. Requiere token JWT válido.
 *     tags:
 *       - Clientes
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - clientKey
 *               - nombre
 *               - celular
 *               - email
 *               - characterIcon
 *             properties:
 *               clientKey:
 *                 type: string
 *                 example: "CLI001"
 *               nombre:
 *                 type: string
 *                 example: "Juan Pérez García"
 *               celular:
 *                 type: string
 *                 example: "+34 666 123 456"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "juan@example.com"
 *               characterIcon:
 *                 type: string
 *                 format: binary
 *                 description: Archivo de imagen del cliente
 *     responses:
 *       200:
 *         description: Cliente creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Client created successfully"
 *       401:
 *         description: No autenticado. Token JWT requerido en header Authorization
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
 *                   example: "Unauthorized: Token de autenticación requerido"
 *       409:
 *         description: El cliente ya existe (clientKey duplicado)
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
 *                   example: "Conflict: Client with key CLI001 already exists"
 *       400:
 *         description: Datos inválidos o campos faltantes
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
 *                   example: "Bad Request: Invalid email format"
 *                 missingFields:
 *                   type: array
 *                   items:
 *                     type: string
 *       500:
 *         description: Error interno del servidor
 */

/**
 * @swagger
 * /api/clients/page/{page}:
 *   get:
 *     summary: Obtener clientes paginados
 *     description: Retorna una lista paginada de clientes (100 por página). Requiere token JWT válido.
 *     tags:
 *       - Clientes
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: page
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *           example: 1
 *         description: Número de página (comienza en 1)
 *     responses:
 *       200:
 *         description: Lista de clientes obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Page 1 retrieved successfully"
 *                 clients:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "507f1f77bcf86cd799439011"
 *                       clientKey:
 *                         type: string
 *                         example: "CLI001"
 *                       nombre:
 *                         type: string
 *                         example: "Juan Pérez"
 *                       celular:
 *                         type: string
 *                         example: "+34 666 123 456"
 *                       email:
 *                         type: string
 *                         example: "juan@example.com"
 *                       characterIcon:
 *                         oneOf:
 *                           - type: number
 *                             example: 5
 *                           - type: object
 *                             properties:
 *                               id:
 *                                 type: string
 *                               url:
 *                                 type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                 totalClients:
 *                   type: number
 *                   example: 100
 *       401:
 *         description: No autenticado
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
 *                   example: "Unauthorized: Token inválido o expirado"
 *       400:
 *         description: Número de página inválido
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
 *                   example: "Invalid Page: Page must be greater than 0"
 *       404:
 *         description: Página no existe
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
 *                   example: "Not Found: Page 999 does not exist"
 */

/**
 * @swagger
 * /api/clients/{clientKey}:
 *   get:
 *     summary: Obtener cliente por ID
 *     description: Retorna los detalles de un cliente específico por su clientKey
 *     tags:
 *       - Clientes
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: clientKey
 *         required: true
 *         schema:
 *           type: string
 *           example: "CLI001"
 *         description: Identificador único del cliente
 *     responses:
 *       200:
 *         description: Cliente encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Cliente con clave CLI001 obtenido correctamente"
 *                 _id:
 *                   type: string
 *                 clientKey:
 *                   type: string
 *                 nombre:
 *                   type: string
 *                 celular:
 *                   type: string
 *                 email:
 *                   type: string
 *                 characterIcon:
 *                   oneOf:
 *                     - type: number
 *                     - type: object
 *       401:
 *         description: No autenticado
 *       404:
 *         description: Cliente no encontrado
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
 *                   example: "Not Found: Client with key CLI001 not found"
 */

/**
 * @swagger
 * /api/clients/{clientKey}:
 *   put:
 *     summary: Actualizar cliente
 *     description: Actualiza los datos de un cliente. Al menos un campo debe ser proporcionado.
 *     tags:
 *       - Clientes
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: clientKey
 *         required: true
 *         schema:
 *           type: string
 *           example: "CLI001"
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Juan Pérez García Actualizado"
 *               celular:
 *                 type: string
 *                 example: "+34 666 987 654"
 *               email:
 *                 type: string
 *                 example: "juan.nuevo@example.com"
 *               characterIcon:
 *                 type: string
 *                 format: binary
 *                 description: Nueva imagen (opcional)
 *     responses:
 *       200:
 *         description: Cliente actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Client with key CLI001 updated successfully"
 *       401:
 *         description: No autenticado
 *       404:
 *         description: Cliente no encontrado
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
 *                   example: "Not Found: Client not found"
 *       409:
 *         description: Conflicto (email o cliente duplicado)
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
 *                   example: "Conflict: Email already in use"
 *       400:
 *         description: Datos inválidos o sin campos para actualizar
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
 *                   example: "Bad Request: At least one field must be provided"
 */

/**
 * @swagger
 * /api/clients/{clientKey}:
 *   delete:
 *     summary: Eliminar cliente
 *     description: Elimina un cliente y todos sus datos asociados del sistema (incluyendo imagen)
 *     tags:
 *       - Clientes
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: clientKey
 *         required: true
 *         schema:
 *           type: string
 *           example: "CLI001"
 *     responses:
 *       200:
 *         description: Cliente eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Client with key CLI001 deleted successfully"
 *       401:
 *         description: No autenticado
 *       404:
 *         description: Cliente no encontrado
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
 *                   example: "Not Found: Client not found"
 */

export class ClientRoutes {
  private router: Router;

  constructor(
    private readonly clientController: ClientController,
    private readonly tokenRepository: TokenRepository
  ) {
    this.router = Router();
    this.setupRoutes();
  }

  private setupRoutes(): void {
    const auth = AuthMiddleware(this.tokenRepository);

    // ⚠️ IMPORTANTE: Las rutas más específicas deben ir ANTES que las genéricas
    // /page/:page debe ir ANTES de /:clientKey
    this.router.post('/', auth, uploadMiddleware.single('characterIcon'), validateCreateClient, (req, res) => 
      this.clientController.createClient(req, res)
    );

    this.router.get('/page/:page', auth, validateGetClients, (req, res) => 
      this.clientController.getPageClients(req, res)
    );

    this.router.get('/:clientKey', auth, validateGetClient, (req, res) => 
      this.clientController.getClient(req, res)
    );

    this.router.put('/:clientKey', auth, uploadMiddleware.single('characterIcon'), validateUpdateClient, (req, res) => 
      this.clientController.updateClient(req, res)
    );

    this.router.delete('/:clientKey', auth, (req, res) => 
      this.clientController.deleteClient(req, res)
    );
  }

  getRouter(): Router {
    return this.router;
  }
}