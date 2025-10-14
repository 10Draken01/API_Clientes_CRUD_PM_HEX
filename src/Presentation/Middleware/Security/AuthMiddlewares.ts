import { TokenService } from "@/src/Domain/Services/TokenService";
import { NextFunction, Request, Response } from "express";

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