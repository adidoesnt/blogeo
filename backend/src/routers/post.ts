import { postController } from 'components/controller';
import { Router } from 'express';

const router = Router();

router.post('/post', async (request, response, next) => {
    return await postController.createPost({
        request,
        response,
        next,
    });
});

export default router;
