import { TodoDao } from '@hexagonal-todo/drivenPorts';
import { TodoDto } from '@hexagonal-todo/drivingPorts';

export class Todo {
  constructor(
    public readonly id: string,
    public name: string,
    public readonly createdAt: Date,
    public updatedAt: Date
  ) {
    if (id === '') {
      throw Error('id cannot be empty');
    }
    if (name === '') {
      throw Error('name cannot be empty');
    }
  }

  toDao(): TodoDao {
    return {
      id: this.id,
      name: this.name,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  toDto(): TodoDto {
    return {
      id: this.id,
      taskName: this.name,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  static fromDao({ id, name, createdAt, updatedAt }: TodoDao): Todo {
    return new Todo(id, name, createdAt, updatedAt);
  }
}
