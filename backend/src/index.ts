import express from 'express';
import cors from 'cors';
import { urlencoded, json } from 'body-parser';
import { healthRouter } from './routers';

const { PORT = 3000 } = process.env;

const app = express();

app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));

app.use(healthRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
