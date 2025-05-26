export interface TodoCreationDto {
  id: string;
  taskName: string;
}

export interface TodoDto {
  id: string;
  taskName: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ForManagingTodos {
  createTodo(todoCreation: TodoCreationDto): Promise<void>;
  getTodo(id: string): Promise<TodoDto | null>;
  renameTodo(id: string, taskName: string): Promise<void>;
}
