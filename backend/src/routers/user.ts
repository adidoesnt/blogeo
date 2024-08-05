import { userController } from 'components/controller';
import { Router } from 'express';

const router = Router();

router.post('/user', async (request, response, next) => {
    return await userController.createUser({
        request,
        response,
        next,
    });
});

export default router;
