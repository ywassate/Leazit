import { Request, Response, NextFunction } from 'express';

export const send404 = (res: Response, message: string) => {
  return res.status(404).json({ message });
};

export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({ 
    message: 'Route non trouvée', 
    code: 'ROUTE_NOT_FOUND' 
  });
};

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Erreur serveur interne',
    ...(process.env.NODE_ENV === 'development' && { error: err.message })
  });
};