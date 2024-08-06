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

export const getPosts = async ({
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
        }
        const posts = await postService.getPostsByUsername(String(username));
        if (posts) {
            const { status, message } = RESPONSE.OK;
            return response.status(status).json({ status, message, posts });
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
