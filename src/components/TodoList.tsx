import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ITodo } from "../types/todo";

export default function TodoList(): JSX.Element {
  const [todos, setTodos] = useState<ITodo[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    const storedTodos = JSON.parse(
      localStorage.getItem("todos") || "[]"
    ) as ITodo[];
    setTodos(storedTodos);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-red-200";
      case "in_progress":
        return "bg-yellow-200";
      case "done":
        return "bg-green-200";
      default:
        return "bg-gray-200";
    }
  };

  const columns: { [key: string]: ITodo[] } = {
    pending: todos.filter((todo) => todo.status === "pending"),
    in_progress: todos.filter((todo) => todo.status === "in_progress"),
    done: todos.filter((todo) => todo.status === "done"),
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold mb-4">Todo Planner</h1>
        <Link to="/todo/create" className="text-blue-500">
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md transition duration-300 ease-in-out hover:bg-blue-600 hover:shadow-md">
            Add new Todo
          </button>
        </Link>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by description"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md mr-2 w-full"
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        {Object.entries(columns).map(([status, items]) => (
          <div key={status} className="border rounded-md p-4 h-full bg-gray-50">
            <h2 className="text-lg font-bold mb-2">
              {status
                .split("_")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")}
            </h2>
            {items.length === 0 ? (
              <p>No todos found.</p>
            ) : (
              <ul>
                {items.map((todo) => (
                  <li key={todo.id}>
                    <Link
                      to={`/todo/edit/${todo.id}`}
                      className="text-gray-900 hover:no-underline"
                    >
                      <div
                        className={`p-4 rounded-md shadow-md ${getStatusColor(
                          todo.status
                        )} mb-4 transition duration-300 ease-in-out hover:bg-blue-100`}
                      >
                        <p className="text-lg font-semibold text-left break-all">
                          {todo.description}
                        </p>
                        <div className="flex justify-between">
                          <p className="text-sm mt-2">{`Status: ${todo.status}`}</p>
                          <p className="text-sm mt-2">{`Created at: ${todo.created_at}`}</p>
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
