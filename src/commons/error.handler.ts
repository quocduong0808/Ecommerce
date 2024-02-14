import { NextFunction, Request, Response } from 'express';

const asyncHandle = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};

export { asyncHandle };
