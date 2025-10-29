import { NextFunction, Response, Request } from "express";

export const validateCreateClient = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.body) {
    res.status(400).json({
      success: false,
      message: 'Faltan campos en el cuerpo/form-data de la solicitud',
      missingFields: [
        'clientKey',
        'name',
        'phone',
        'email'
      ].filter(Boolean)
    });
    return;
  }

  const { clientKey, name, phone, email } = req.body;
  // mostrar el body en consola para debug

  if (!clientKey || !name || !phone || !email) {
    // Respuesta de error con campos faltantes y especificando la ruta y un ejemplo de uso
    res.status(400).json({
      success: false,
      message: 'Todos los campos clientKey, name, phone y email son requeridos en el cuerpo de la solicitud.',
      missingFields: [
        !clientKey ? 'clientKey' : undefined,
        !name ? 'name' : undefined,
        !phone ? 'phone' : undefined,
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
        clientKey: '123',
        name: 'Juan Perez',
        phone: '5551234567',
        email: 'juan@example.com',
        characterIcon: '<archivo o numero>'
      }
    });
    return;
  }

  next();
};


export const validateUpdateClient = (req: Request, res: Response, next: NextFunction): void => {
  const clientKeyParams = req.params.clientKey;

  if (!clientKeyParams) {
    res.status(400).json({
      success: false,
      message: 'El parámetro clientKey es requerido en la ruta. Ejemplo: PUT http://localhost:3000/api/clients/1',
      missingField: 'clientKey'
    });
    return;
  }

  if (!req.body) {
    res.status(400).json({
      success: false,
      message: 'Faltan campos en el cuerpo de la solicitud',
      missingFields: [
        'name',
        'phone',
        'email',
        'characterIcon'
      ].filter(Boolean)
    });
    return;
  }

  // Validar que al menos un campo a actualizar esté presente en el body
  const { name, phone, email, characterIcon } = req.body;
  if (!name && !phone && !email && !characterIcon && !(req as any).file?.buffer) {
    res.status(400).json({
      success: false,
      message: 'Debe proporcionar al menos un campo para actualizar: name, phone, email o characterIcon.',
      example: {
        name: 'New Name',
        phone: '5551234567',
        email: 'email@email.com',
        characterIcon: '<file or number>'
      }
    });
    return;
  }

  next();
};

export const validateGetClients = (req: Request, res: Response, next: NextFunction): void => {
  const page_params = req.params.page;

  if (!page_params) {
    res.status(400).json({
      success: false,
      message: 'Page required for route query. /page/:page example: GET:http://localhost:80/api/clients/page/1'
    });
    return;
  }

  next();
};

export const validateGetClient = (req: Request, res: Response, next: NextFunction): void => {
  const clientKey = req.params.clientKey;

  if (!clientKey) {
    res.status(400).json({
      success: false,
      message: 'Client key required for route query. /:clientKey example: GET:http://localhost:80/api/clients/1'
    });
    return;
  }

  next();
};

export const validateDeleteClient = (req: Request, res: Response, next: NextFunction): void => {
  const clientKey = req.params.clientKey;

  if (!clientKey) {
    res.status(400).json({
      success: false,
      message: 'Client key required for route query. /:clientKey example: DELETE:http://localhost:80/api/clients/1'
    });
    return;
  }

  next();
};

