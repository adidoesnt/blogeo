import { postService } from 'components/service';
import { RESPONSE } from 'constants/response';
import type { ControllerProps, CustomError } from './types';

export const createPost = async ({
    request,
    response,
    next,
}: ControllerProps) => {
    try {
        const { body } = request;
        const post = await postService.createPost(body);
        if (post) {
            const { status, message } = RESPONSE.CREATED;
            return response.status(status).json({ status, message, post });
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
