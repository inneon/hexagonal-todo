import { InMemoryTodoPersistence } from './inMemoryTodoPersistence';

describe('inMemoryTodoPersistence', () => {
  describe('basic persistence', () => {
    it('should persist the todo', async () => {
      const persistence = new InMemoryTodoPersistence();

      const id = 'testId';
      const original = {
        id,
        name: 'name',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await persistence.upsertTodo(original);

      const result = await persistence.getTodoById(id);

      expect(result).toEqual(original);
    });

    it('wont get a todo if it doesnt exist', async () => {
      const persistence = new InMemoryTodoPersistence();

      const id = 'testId';

      await persistence.upsertTodo({
        id,
        name: 'name',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await persistence.getTodoById('differentId');

      expect(result).toEqual(null);
    });

    it('overwrites an existing todo', async () => {
      const persistence = new InMemoryTodoPersistence();

      const id = 'testId';
      const original = {
        id,
        name: 'name',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      await persistence.upsertTodo(original);

      await persistence.upsertTodo({ ...original, name: 'updatedName' });

      const result = await persistence.getTodoById(id);

      expect(result).toEqual({ ...original, name: 'updatedName' });
    });
  });
});
