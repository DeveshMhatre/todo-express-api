import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import helmet from 'helmet';
import cors from 'cors';

import indexRouter from './routes/index';
import usersRouter from './routes/users';
import todosRouter from './routes/todos';
import verifyToken from './middlewares/authJWT';

const app = express();

app.use(logger('dev'));
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));

// Auth-only routes
app.use('/api/v1/', verifyToken, indexRouter);
app.use('/api/v1/todos', verifyToken, todosRouter);

app.use('/api/v1/users', usersRouter);

export default app;
