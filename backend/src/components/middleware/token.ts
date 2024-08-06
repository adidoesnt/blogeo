import type { Request, Response, NextFunction } from 'express';
import { RESPONSE } from 'constants/response';
import { tokenService } from 'components/service';

const getTokenFromRequest = (request: Request): string | null => {
    const authorization = request.headers.authorization;
    if (!authorization) return null;
    const [, token] = authorization.split(' ');
    return token;
};

export const tokenValidator = async (
    request: Request,
    response: Response,
    next: NextFunction,
) => {
    const token = getTokenFromRequest(request);
    if (!token) {
        const { status, message } = RESPONSE.UNAUTHORISED;
        return response.status(status).json({ status, message });
    }
    const valid = await tokenService.validateToken(token);
    if (!valid) {
        const { status, message } = RESPONSE.FORBIDDEN;
        return response.status(status).json({ status, message });
    }
    next();
};
