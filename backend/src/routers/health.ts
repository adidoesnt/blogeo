import { Router } from 'express';
import { RESPONSE } from 'constants/response';

const router = Router();

router.get(/^\/(health)?$/, (_, res) => {
    const { status, message } = RESPONSE.OK;
    res.status(status).json({ status, message });
});

export default router;
