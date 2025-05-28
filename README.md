# HexagonalTodo

A playground for exploring how a [Ports and Adaptors](https://medium.com/the-software-architecture-chronicles/ports-adapters-architecture-d19f2d476eca) (aka Hexagonal) style app can be applied to the 'Hello world of JavaScript' - a todo list. The project utilises nx to create, separate and then link each of the core parts of P&A.

## Blog posts

- [Instability, abstractness and the 'main sequence'](./blogPosts/instability.md)

## Run tasks

To run the dev server for your app, use:

```sh
npx nx serve hexagonal-todo
```

To create a production bundle:

```sh
npx nx build hexagonal-todo
```

To see all available targets to run for a project, run:

```sh
npx nx show project hexagonal-todo
```

These targets are either [inferred automatically](https://nx.dev/concepts/inferred-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) or defined in the `project.json` or `package.json` files.
