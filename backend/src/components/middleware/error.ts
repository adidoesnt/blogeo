import type { CustomError } from 'components/controller/types';
import type { Request, Response, NextFunction } from 'express';

export const errorHandler = (
    error: Error | CustomError,
    _request: Request,
    response: Response,
    _next: NextFunction,
): void => {
    console.error('Error handling request', error);
    response
        .status((error as CustomError).status || 500)
        .json({ message: error.message });
};
