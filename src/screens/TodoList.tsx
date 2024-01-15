import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ITodo } from "../types/todo";
import { TodoStatus } from "../enums/status";
import TodoItem from "../components/TodoItem";
import TodoFilter from "../components/TodoFilter";
import { useDebounce } from "../components/hooks/useDebounce";

export default function TodoList(): JSX.Element {
  const [todos, setTodos] = useState<ITodo[]>([]);
  const [filteredTodos, setFilteredTodos] = useState<ITodo[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    const storedTodos = JSON.parse(
      localStorage.getItem("todos") || "[]"
    ) as ITodo[];

    const groupedTodos = groupTodosByStatus(storedTodos);
    setTodos(groupedTodos);
    setFilteredTodos(groupedTodos);
  }, []);

  useEffect(() => {
    const filtered = todos.filter((todo) =>
      todo.description.includes(debouncedSearchTerm)
    );
    setFilteredTodos(filtered);
  }, [todos, debouncedSearchTerm]);

  const groupTodosByStatus = (todos: ITodo[]): ITodo[] => {
    const groupedTodos: ITodo[] = [];
    const statusMap: { [key: string]: ITodo[] } = {};

    todos.forEach((todo) => {
      const status = todo.status;
      if (!statusMap[status]) {
        statusMap[status] = [];
      }
      statusMap[status].push(todo);
    });

    for (const status in statusMap) {
      groupedTodos.push(...statusMap[status]);
    }

    return groupedTodos;
  };

  const columns: { [key: string]: ITodo[] } = {
    pending: filteredTodos.filter((todo) => todo.status === TodoStatus.Pending),
    in_progress: filteredTodos.filter(
      (todo) => todo.status === TodoStatus.InProgress
    ),
    done: filteredTodos.filter((todo) => todo.status === TodoStatus.Done),
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold mb-4">Todo Planner</h1>
        <Link to="/todo/create" className="text-blue-500">
          <button className="bg-blue-500 text-white px-4 py-2 mb-2 rounded-md transition duration-300 ease-in-out hover:bg-blue-600 hover:shadow-md">
            Add new Todo
          </button>
        </Link>
      </div>

      <TodoFilter onSearchTermChange={setSearchTerm} />

      <div className="grid grid-cols-3 gap-4">
        {Object.entries(columns).map(([status, items]) => {
          if (items.length === 0) {
            return (
              <div
                key={status}
                className="border rounded-md p-4 h-full bg-gray-50"
              >
                <h2 className="text-lg font-bold mb-2">
                  {status
                    .split("_")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}
                </h2>
                <p>No todos found.</p>
              </div>
            );
          }

          return (
            <div
              key={status}
              className="border rounded-md p-4 h-full bg-gray-50"
            >
              <h2 className="text-lg font-bold mb-2">
                {status
                  .split("_")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ")}
              </h2>
              <ul>
                {items.map((todo) => (
                  <li key={todo.id}>
                    <Link
                      to={`/todo/edit/${todo.id}`}
                      className="text-gray-900 hover:no-underline"
                    >
                      <TodoItem todo={todo} />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
