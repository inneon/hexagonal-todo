import { ForPersistingTodos, TodoDao } from '@hexagonal-todo/drivenPorts';

export class InMemoryTodoPersistence implements ForPersistingTodos {
  private library: { [key: string]: TodoDao } = {};

  upsertTodo(todo: TodoDao): Promise<void> {
    this.library[todo.id] = todo;
    return Promise.resolve();
  }
  getTodoById(id: string): Promise<TodoDao | null> {
    const result = this.library[id];
    return Promise.resolve(result ?? null);
  }
}
