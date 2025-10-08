import { Request, Response, NextFunction } from 'express';
import { TokenService } from '../../Domain/Services/TokenService';

export const validateRegister = (req: Request, res: Response, next: NextFunction): void => {
    if (!req.body) {
    res.status(400).json({
      success: false,
      message: 'Faltan campos en el cuerpo de la solicitud',
      missingFields: [
        'username',
        'email',
        'password'
      ].filter(Boolean)
    });
    return;
  }

  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    res.status(400).json({ 
      success: false,
      message: 'Username, Email y Password son requeridos en el cuerpo de la solicitud.',
      missingFields: [
        !username ? 'username' : undefined,
        !email ? 'email' : undefined,
        !password ? 'password' : undefined
      ].filter(Boolean)
    });
    return;
  }
  next();
};

export const validateLogin = (req: Request, res: Response, next: NextFunction): void => {

  if (!req.body) {
    res.status(400).json({
      success: false,
      message: 'Faltan campos en el cuerpo de la solicitud',
      missingFields: [
        'email',
        'password'
      ].filter(Boolean)
    });
    return;
  }

  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ 
      success: false,
      message: 'Email y Password son requeridos en el cuerpo de la solicitud.',
      missingFields: [
        !email ? 'email' : undefined,
        !password ? 'password' : undefined
      ].filter(Boolean)
    });
    return;
  }
  next();
};

export const validateCreateCliente = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.body) {
    res.status(400).json({
      success: false,
      message: 'Faltan campos en el cuerpo/form-data de la solicitud',
      missingFields: [
        'claveCliente',
        'nombre',
        'celular',
        'email'
      ].filter(Boolean)
    });
    return;
  }

  const { claveCliente, nombre, celular, email } = req.body;
  // mostrar el body en consola para debug

  if (!claveCliente || !nombre || !celular || !email) {
    // Respuesta de error con campos faltantes y especificando la ruta y un ejemplo de uso
    res.status(400).json({
      success: false,
      message: 'Todos los campos claveCliente, nombre, celular y email son requeridos en el cuerpo de la solicitud.',
      missingFields: [
        !claveCliente ? 'claveCliente' : undefined,
        !nombre ? 'nombre' : undefined,
        !celular ? 'celular' : undefined,
        !email ? 'email' : undefined
      ].filter(Boolean)
    });
    return;
  }

  // Validación previa del archivo (opcional, depende de tu lógica de negocio)
  const file = (req as any).file;
  if (!file?.buffer && !req.body.characterIcon) {
    res.status(400).json({
      success: false,
      message: 'El campo characterIcon (archivo o numero) es requerido en el form-data/cuerpo de la solicitud.',
      example: {
        claveCliente: '123',
        nombre: 'Juan Perez',
        celular: '5551234567',
        email: 'juan@example.com',
        characterIcon: '<archivo o numero>'
      }
    });
    return;
  }

  next();
};


export const validateUpdateCliente = (req: Request, res: Response, next: NextFunction): void => {
  const claveClienteParams = req.params.claveCliente;

  if (!claveClienteParams) {
    res.status(400).json({
      success: false,
      message: 'El parámetro claveCliente es requerido en la ruta. Ejemplo: PUT http://localhost:3000/api/clientes/1',
      missingField: 'claveCliente'
    });
    return;
  }

  if (!req.body) {
    res.status(400).json({
      success: false,
      message: 'Faltan campos en el cuerpo de la solicitud',
      missingFields: [
        'nombre',
        'celular',
        'email',
        'characterIcon'
      ].filter(Boolean)
    });
    return;
  }

  // Validar que al menos un campo a actualizar esté presente en el body
  const { nombre, celular, email, characterIcon } = req.body;
  if (!nombre && !celular && !email && !characterIcon && !(req as any).file?.buffer) {
    res.status(400).json({
      success: false,
      message: 'Debe proporcionar al menos un campo para actualizar: nombre, celular, email o characterIcon.',
      example: {
        nombre: 'Nuevo Nombre',
        celular: '5551234567',
        email: 'nuevo@email.com',
        characterIcon: '<archivo o numero>'
      }
    });
    return;
  }

  next();
};

export const validateGetClientes = (req: Request, res: Response, next: NextFunction): void => {
  const page_params = req.params.page;

  if (!page_params) {
    res.status(400).json({
      success: false,
      message: 'Pagina es requerida en los parámetros de la ruta. /page/:page ejemplo: GET:http://localhost:3000/api/clientes/page/1'
    });
    return;
  }

  next();
};

export const validateGetCliente = (req: Request, res: Response, next: NextFunction): void => {
  const claveCliente = req.params.claveCliente;

  if (!claveCliente) {
    res.status(400).json({
      success: false,
      message: 'Clave cliente es requerida en los parámetros de la ruta. /:claveCliente ejemplo: GET:http://localhost:3000/api/clientes/1'
    });
    return;
  }

  next();
};

export const validateDeleteCliente = (req: Request, res: Response, next: NextFunction): void => {
  const claveCliente = req.params.claveCliente;

  if (!claveCliente) {
    res.status(400).json({
      success: false,
      message: 'Clave cliente es requerida en los parámetros de la ruta. /:claveCliente ejemplo: DELETE:http://localhost:3000/api/clientes/1'
    });
    return;
  }

  next();
};

export const AuthMiddleware = (tokenService: TokenService) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader?.split(' ')[1];

      if (!token) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized: Token de autenticación requerido.'
        });
        return;
      }

      const decoded = await tokenService.verifyToken(token);
      (req as any).user = decoded;
      next();
    } catch (err) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized: Token inválido o expirado.'
      });
    }
  };
};