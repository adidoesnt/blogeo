import type { Request, Response, NextFunction } from 'express';

export type ControllerProps = {
    request: Request;
    response: Response;
    next: NextFunction;
};

export type CustomError = Error & {
    status?: number;
};
