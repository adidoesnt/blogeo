import { userService } from 'components/service';
import {
    type ControllerProps,
    type CustomError,
} from 'components/controller/types';
import { RESPONSE } from 'constants/response';

export const signup = async ({ request, response, next }: ControllerProps) => {
    try {
        const { body } = request;
        const user = await userService.signup(body);
        if (user) {
            const { status, message } = RESPONSE.CREATED;
            return response.status(status).json({ status, message, user });
        } else {
            const { status, message } = RESPONSE.BAD_REQUEST;
            const error: CustomError = new Error(message);
            error.status = status;
            throw error;
        }
    } catch (error) {
        next(error);
    }
};

export const login = async ({ request, response, next }: ControllerProps) => {
    try {
        const { body } = request;
        const user = await userService.login(body);
        if (user) {
            const { status, message } = RESPONSE.OK;
            return response.status(status).json({ status, message, user });
        } else {
            const { status, message } = RESPONSE.BAD_REQUEST;
            const error: CustomError = new Error(message);
            error.status = status;
            throw error;
        }
    } catch (error) {
        next(error);
    }
};

export const logout = async ({ request, response, next }: ControllerProps) => {
    try {
        const { token } = request.body;
        await userService.logout(token);
        const { status, message } = RESPONSE.OK;
        return response.status(status).json({ status, message });
    } catch (error) {
        next(error);
    }
};

export const createBlog = async ({
    request,
    response,
    next,
}: ControllerProps) => {
    try {
        const { body } = request;
        await userService.createBlog(body);
        const { status, message } = RESPONSE.OK;
        return response.status(status).json({ status, message });
    } catch (error) {
        next(error);
    }
};

export const getUserBlogStatus = async ({
    request,
    response,
    next,
}: ControllerProps) => {
    try {
        const { username } = request.query;
        if (!username || Array.isArray(username)) {
            const { status, message } = RESPONSE.BAD_REQUEST;
            const error: CustomError = new Error(message);
            error.status = status;
            throw error;
        } else {
            const blogStatus = await userService.getUserBlogStatus(username as string);
            if (!blogStatus) {
                const { status, message } = RESPONSE.NOT_FOUND;
                const error: CustomError = new Error(message);
                error.status = status;
                throw error;
            }   
            const { status, message } = RESPONSE.OK;
            return response.status(status).json({ status, message, blogStatus });
        }
    } catch (error) {
        next(error);
    }
};
