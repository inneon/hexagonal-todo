import { ForManagingTodos } from '@hexagonal-todo/drivingPorts';
import {
  ForPersistingTodos,
  ForGettingTime,
} from '@hexagonal-todo/drivenPorts';
import {
  InMemoryTodoPersistence,
  GettingSystemTime,
} from '@hexagonal-todo/drivenAdaptors';
import { TodoService } from '@hexagonal-todo/domain';

export const buildTodoApp = (): ForManagingTodos => {
  const persistence: ForPersistingTodos = new InMemoryTodoPersistence();
  const time: ForGettingTime = new GettingSystemTime();

  return new TodoService(persistence, time);
};
