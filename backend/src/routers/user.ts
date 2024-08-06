import { userController } from 'components/controller';
import { tokenValidator } from 'components/middleware/token';
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

router.use(tokenValidator);

router.post('/logout', async (request, response, next) => {
    return await userController.logout({
        request,
        response,
        next,
    });
});

export default router;
