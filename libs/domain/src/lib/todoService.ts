import {
  ForManagingTodos,
  TodoCreationDto,
  TodoDto,
} from '@hexagonal-todo/drivingPorts';
import {
  ForPersistingTodos,
  ForGettingTime,
} from '@hexagonal-todo/drivenPorts';
import { Todo } from './todo';

export class TodoService implements ForManagingTodos {
  constructor(
    private readonly forPersistingTodos: ForPersistingTodos,
    private readonly forGettingTime: ForGettingTime
  ) {}
  async createTodo({ id, taskName }: TodoCreationDto): Promise<void> {
    const existing = await this.forPersistingTodos.getTodoById(id);
    if (existing) {
      throw Error(`Todo with id '${id}' already exists`);
    }

    const now = this.forGettingTime.getNow();
    const todo = new Todo(id, taskName, now, now);

    await this.forPersistingTodos.upsertTodo(todo.toDao());
  }

  async renameTodo(id: string, newName: string): Promise<void> {
    const existing = await this.forPersistingTodos.getTodoById(id);
    if (!existing) {
      throw Error(`Todo with id '${id}' could not be found`);
    }

    const todo = Todo.fromDao(existing);
    todo.name = newName;
    todo.updatedAt = this.forGettingTime.getNow();

    await this.forPersistingTodos.upsertTodo(todo.toDao());
  }

  async getTodo(id: string): Promise<TodoDto | null> {
    const existing = await this.forPersistingTodos.getTodoById(id);
    if (!existing) {
      return null;
    }

    const todo = Todo.fromDao(existing);

    return todo.toDto();
  }
}
