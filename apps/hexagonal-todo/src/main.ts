import { todoExpressWrapper } from '@hexagonal-todo/drivingAdaptors';
import express from 'express';
import { buildTodoApp } from './buildTodoApp';

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const app = express();
app.use(express.json());

const todoRouter = todoExpressWrapper(buildTodoApp());
app.use('/todo', todoRouter);

app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});
