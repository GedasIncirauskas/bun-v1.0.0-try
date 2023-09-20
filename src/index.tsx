import { renderToString } from "react-dom/server";

const server = Bun.serve({
  hostname: "localhost",
  port: 3000,
  fetch: fetchHandler,
});

console.log(`Bun is running on ${server.hostname}:${server.port}`);

type Todo = { id: number; name: string };
const todoList: Todo[] = [];

async function fetchHandler(request: Request): Promise<Response> {
  const url = new URL(request.url);

  if (url.pathname === "" || url.pathname === "/") {
    return new Response(Bun.file("index.html"));
  }

  if (url.pathname === "/todos" && request.method === "GET") {
    return new Response(renderToString(<TodoList todos={todoList} />));
  }

  if (url.pathname === "/todos" && request.method === "POST") {
    const { todo } = await request.json();
    todoList.push({
      id: todoList.length + 1,
      name: todo,
    });
    return new Response(renderToString(<TodoList todos={todoList} />));
  }

  return new Response("Page Not Found", { status: 404 });
}

function TodoList(props: { todos: Todo[] }) {
  const { todos } = props;
  return (
    <ul>
      {todos.length ? (
        todos.map(({ id, name }) => <li key={id}>{name}</li>)
      ) : (
        <span>No todos yet!</span>
      )}
    </ul>
  );
}
