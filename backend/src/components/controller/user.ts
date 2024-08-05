import { userService } from 'components/service';
import {
    type ControllerProps,
    type CustomError,
} from 'components/controller/types';
import { RESPONSE } from 'constants/response';

export const createUser = async ({
    request,
    response,
    next,
}: ControllerProps) => {
    try {
        const { body } = request;
        const user = await userService.createUser(body);
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
