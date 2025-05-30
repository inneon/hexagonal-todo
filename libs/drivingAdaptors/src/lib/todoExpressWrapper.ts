import { ForManagingTodos } from '@hexagonal-todo/drivingPorts';
import express from 'express';

export const startTodoExpressService = (
  forManagingTodos: ForManagingTodos,
  host: string,
  port: number
) => {
  const app = express();
  app.use(express.json());

  const todoRouter = todoExpressWrapper(forManagingTodos);
  app.use('/todo', todoRouter);

  app.listen(port, host, () => {
    console.log(`[ ready ] http://${host}:${port}`);
  });

  return app;
};

export const todoExpressWrapper = (
  forManagingTodos: ForManagingTodos
): express.Router => {
  const router = express.Router();

  router.put('/', async (req, res) => {
    try {
      const { id, taskName } = req.body;
      if (!id) {
        return res.status(400).json({ error: 'id not defined' });
      }
      if (!taskName) {
        return res.status(400).json({ error: 'taskName not defined' });
      }
      await forManagingTodos.createTodo({ id, taskName });
      return res.status(201).json({ message: 'Todo created successfully' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  router.get('/:id', async (req, res) => {
    try {
      const id = req.params.id;
      const todo = await forManagingTodos.getTodo(id);
      if (!todo) {
        return res.status(404).json({ error: 'Todo not found' });
      }
      return res.json(todo);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  router.post('/:id/rename', async (req, res) => {
    try {
      const id = req.params.id;
      const { newName } = req.body;
      if (!id) {
        return res.status(400).json({ error: 'id not defined' });
      }
      if (!newName) {
        return res.status(400).json({ error: 'newName not defined' });
      }
      await forManagingTodos.renameTodo(id, newName);
      return res.status(201).json({ message: 'Todo renamed successfully', id });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  return router;
};
