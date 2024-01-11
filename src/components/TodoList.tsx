import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ITodo } from "../types/todo";

export default function TodoList(): JSX.Element {
  const [todos, setTodos] = useState<ITodo[]>([]);
  const [filteredTodos, setFilteredTodos] = useState<ITodo[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    const storedTodos = JSON.parse(
      localStorage.getItem("todos") || "[]"
    ) as ITodo[];
    setTodos(storedTodos);
  }, []);

  useEffect(() => {
    let filtered = todos;

    if (searchTerm) {
      filtered = filtered.filter((todo) =>
        todo.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredTodos(filtered);
  }, [todos, searchTerm]);

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

  // Group todos by status
  const groupedTodos: { [key: string]: ITodo[] } = {};
  filteredTodos.forEach((todo) => {
    if (!groupedTodos[todo.status]) {
      groupedTodos[todo.status] = [];
    }
    groupedTodos[todo.status].push(todo);
  });

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Todo Planner</h1>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center w-full">
          <input
            type="text"
            placeholder="Search by description"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md mr-2"
          />
          <Link to="/todo/create" className="text-blue-500">
            <button className="bg-blue-500 text-white px-4 py-2 rounded-md transition duration-300 ease-in-out hover:bg-blue-600 hover:shadow-md">
              Add new Todo
            </button>
          </Link>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {/* Columns for each status */}
        {Object.entries(groupedTodos).map(([status, todos]) => (
          <div key={status} className="col-span-1">
            <h2 className="text-lg font-bold mb-2">{status}</h2>
            <ul>
              {todos.map((todo) => (
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
                        <p className="text-sm mt-2">{`Created at: ${todo.created_at}`}</p>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
