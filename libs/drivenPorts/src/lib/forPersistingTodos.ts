export interface TodoDao {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ForPersistingTodos {
  upsertTodo(todo: TodoDao): Promise<void>;
  getTodoById(id: string): Promise<TodoDao | null>;
}
