import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {ITodo} from "../types/todo";

export default function TodoList() {
  const [todos, setTodos] = useState<ITodo[]>([]);
  const [filteredTodos, setFilteredTodos] = useState<ITodo[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    const storedTodos = JSON.parse(
      localStorage.getItem("todos") || "[]"
    ) as ITodo[];
    setTodos(storedTodos);
  }, []);

  useEffect(() => {
    let filtered = todos;

    if (filterStatus !== "all") {
      filtered = filtered.filter((todo) => todo.status === filterStatus);
    }

    if (searchTerm) {
      filtered = filtered.filter((todo) =>
        todo.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredTodos(filtered);
  }, [todos, filterStatus, searchTerm]);

  return (
    <div className="container flex flex-col mx-auto p-4 h-[100svh]">
      <h1 className="text-2xl font-bold mb-4">Todo List</h1>

      <div className="flex items-center mb-4">
        <input
          type="text"
          placeholder="Search by description"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md mr-2 basis-8/12"
        />
        <div className="basis-4/12">
          <label>
            <input
              type="radio"
              name="status"
              value="all"
              checked={filterStatus === "all"}
              onChange={() => setFilterStatus("all")}
              className="mr-1 ml-2"
            />
            {""}All
          </label>
          <label>
            <input
              type="radio"
              name="status"
              value="pending"
              checked={filterStatus === "pending"}
              onChange={() => setFilterStatus("pending")}
              className="ml-3"
            />{" "}
            Pending
          </label>
          <label>
            <input
              type="radio"
              name="status"
              value="in_progress"
              checked={filterStatus === "in_progress"}
              onChange={() => setFilterStatus("in_progress")}
              className="ml-3"
            />{" "}
            In Progress
          </label>
          <label>
            <input
              type="radio"
              name="status"
              value="done"
              checked={filterStatus === "done"}
              onChange={() => setFilterStatus("done")}
              className="ml-3"
            />{" "}
            Done
          </label>
        </div>
      </div>

        {filteredTodos.length === 0 ? (
          <p className="flex flex-col justify-center items-center basis-full">
            No todos found. <Link to="/todo/create" className="text-blue-500">Create one?</Link>
          </p>
        ) : (
          <ul>
            {filteredTodos.map((todo) => (
              <li key={todo.id}>
                <Link to={`/todo/edit/${todo.id}`} className="text-blue-500 hover:underline">{todo.description}</Link>
              </li>
            ))}
          </ul>
        )}
    </div>
  );
}
