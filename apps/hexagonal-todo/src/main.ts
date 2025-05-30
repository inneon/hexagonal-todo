import { startTodoExpressService } from '@hexagonal-todo/drivingAdaptors';
import { buildTodoApp } from './buildTodoApp';

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

startTodoExpressService(buildTodoApp(), host, port);
