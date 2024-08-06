import { postController } from 'components/controller';
import { tokenValidator } from 'components/middleware/token';
import { Router } from 'express';

const router = Router();

router.get('/posts', async (request, response, next) => {
    return await postController.getPosts({
        request,
        response,
        next,
    });
});

router.use(tokenValidator);

router.post('/post', async (request, response, next) => {
    return await postController.createPost({
        request,
        response,
        next,
    });
});

export default router;
