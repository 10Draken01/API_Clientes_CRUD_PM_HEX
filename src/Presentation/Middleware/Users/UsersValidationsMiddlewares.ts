import { Request, Response, NextFunction } from 'express';

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