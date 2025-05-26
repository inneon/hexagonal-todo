import { TodoService } from './todoService';
import {
  ForGettingTime,
  ForPersistingTodos,
} from '@hexagonal-todo/drivenPorts';

describe('todoService', () => {
  const forPersistingTodosFactory = (
    overrides: Partial<ForPersistingTodos> = {}
  ) => {
    const result: ForPersistingTodos = {
      upsertTodo: jest.fn(),
      getTodoById: jest.fn(),
      ...overrides,
    };
    return result;
  };

  const forGettingTimeFactory = (overrides: Partial<ForGettingTime> = {}) => {
    const result: ForGettingTime = {
      getNow: jest.fn(),
      ...overrides,
    };
    return result;
  };

  describe('createTodo', () => {
    it('should persist the todo', async () => {
      const someDate = new Date('2000-01-02T03:04:05');
      const fakePersistence = forPersistingTodosFactory();
      const fakeTime = forGettingTimeFactory({
        getNow: jest.fn().mockReturnValue(someDate),
      });
      const todoService = new TodoService(fakePersistence, fakeTime);

      await todoService.createTodo({
        id: 'abc-123',
        taskName: 'make the tests work',
      });

      expect(fakePersistence.upsertTodo).toHaveBeenCalledWith({
        id: 'abc-123',
        name: 'make the tests work',
        createdAt: someDate,
        updatedAt: someDate,
      });
    });

    it('should not allow new todos with the same id', async () => {
      const someDate = new Date('2000-01-02T03:04:05');
      const fakePersistence = forPersistingTodosFactory({
        getTodoById: jest.fn().mockResolvedValue({
          id: 'abc-123',
          name: 'already exists',
          createdAt: someDate,
          updatedAt: someDate,
        }),
      });
      const fakeTime = forGettingTimeFactory();
      const todoService = new TodoService(fakePersistence, fakeTime);

      expect(
        async () =>
          await todoService.createTodo({
            id: 'abc-123',
            taskName: 'make the tests work',
          })
      ).rejects.toThrow("Todo with id 'abc-123' already exists");
    });
  });

  describe('renameTodo', () => {
    it('should rename the todo', async () => {
      const someDate = new Date('2000-01-02T03:04:05');
      const laterDate = new Date('2000-02-03T04:05:06');
      const fakePersistence = forPersistingTodosFactory({
        getTodoById: jest.fn().mockResolvedValue({
          id: 'abc-123',
          name: 'oppps, spellign miskate',
          createdAt: someDate,
          updatedAt: someDate,
        }),
      });
      const fakeTime = forGettingTimeFactory({
        getNow: jest.fn().mockReturnValue(laterDate),
      });
      const todoService = new TodoService(fakePersistence, fakeTime);

      await todoService.renameTodo('abc-123', 'better spelling');

      expect(fakePersistence.upsertTodo).toHaveBeenCalledWith({
        id: 'abc-123',
        name: 'better spelling',
        createdAt: someDate,
        updatedAt: laterDate,
      });
    });

    it('should throw an error if the todo cannot be found', async () => {
      const fakePersistence = forPersistingTodosFactory({
        getTodoById: jest.fn().mockResolvedValue(null),
      });
      const fakeTime = forGettingTimeFactory();
      const todoService = new TodoService(fakePersistence, fakeTime);

      expect(async () => {
        await todoService.renameTodo('def-456', 'better spelling');
      }).rejects.toThrow(Error("Todo with id 'def-456' could not be found"));
    });
  });

  describe('getTodo', () => {
    it('should get a todo', async () => {
      const someDate = new Date('2000-01-02T03:04:05');
      const fakePersistence = forPersistingTodosFactory({
        getTodoById: jest.fn().mockResolvedValue({
          id: 'abc-123',
          name: 'oppps, spellign miskate',
          createdAt: someDate,
          updatedAt: someDate,
        }),
      });
      const fakeTime = forGettingTimeFactory();
      const todoService = new TodoService(fakePersistence, fakeTime);

      const result = await todoService.getTodo('abc-123');

      expect(fakePersistence.getTodoById).toHaveBeenCalledWith('abc-123');
      expect(result).toEqual({
        id: 'abc-123',
        taskName: 'oppps, spellign miskate',
        createdAt: someDate,
        updatedAt: someDate,
      });
    });

    it('should not get a todo that doesnt exist', async () => {
      const fakePersistence = forPersistingTodosFactory({
        getTodoById: jest.fn().mockResolvedValue(null),
      });
      const fakeTime = forGettingTimeFactory();
      const todoService = new TodoService(fakePersistence, fakeTime);

      const result = await todoService.getTodo('abc-123');

      expect(fakePersistence.getTodoById).toHaveBeenCalledWith('abc-123');
      expect(result).toEqual(null);
    });
  });
});
