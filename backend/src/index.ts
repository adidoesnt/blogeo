import express from 'express';
import cors from 'cors';
import { urlencoded, json } from 'body-parser';
import { healthRouter, userRouter, postRouter } from './routers';
import { database } from 'components';
import { errorHandler } from 'components/middleware/error';

const { PORT = 3000 } = process.env;

const app = express();

app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));

app.use(healthRouter);
app.use(userRouter);
app.use(postRouter);

app.use(errorHandler);

app.listen(PORT, async () => {
    await database.init();
    await database.migrate();
    console.log(`🚀 Server is running on port ${PORT}!`);
});
