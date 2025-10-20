import { ZodError } from 'zod';
import { Request, Response, NextFunction } from 'express';

export class HttpError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export const notFound = () => {
  throw new HttpError(404, 'Resource not found');
};

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof HttpError) {
    return res.status(err.status).json({ message: err.message });
  }

  if (err instanceof ZodError) {
    return res.status(400).json({ message: 'Invalid request', issues: err.errors });
  }

  console.error(err);
  return res.status(500).json({ message: 'Internal server error' });
}
