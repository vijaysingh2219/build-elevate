import { NextFunction, Request, Response } from 'express';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
) => {
  console.error(err.stack);

  res.status(500).json({
    error: 'Internal Server Error',
    name: err.name,
    message: err.message,
  });
};
