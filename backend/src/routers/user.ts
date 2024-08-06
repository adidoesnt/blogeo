import { userController } from 'components/controller';
import { Router } from 'express';

const router = Router();

router.post('/signup', async (request, response, next) => {
    return await userController.signup({
        request,
        response,
        next,
    });
});

router.post('/login', async (request, response, next) => {
    return await userController.login({
        request,
        response,
        next,
    });
});

router.post('/logout', async (request, response, next) => {
    return await userController.logout({
        request,
        response,
        next,
    });
});

export default router;
