import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

interface Todo {
  id: string;
  description: string;
  status: "pending" | "in_progress" | "done";
}

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    const storedTodos = JSON.parse(
      localStorage.getItem("todos") || "[]"
    ) as Todo[];
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
    <div>
      <h1>Todo List</h1>

      <div>
        <input
          type="text"
          placeholder="Search by description"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div>
          <label>
            <input
              type="radio"
              name="status"
              value="all"
              checked={filterStatus === "all"}
              onChange={() => setFilterStatus("all")}
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
            />{" "}
            Done
          </label>
        </div>
      </div>

      <div>
        {filteredTodos.length === 0 ? (
          <p>
            No todos found. <Link to="/todo/create">Create one?</Link>
          </p>
        ) : (
          <ul>
            {filteredTodos.map((todo) => (
              <li key={todo.id}>
                <Link to={`/todo/edit/${todo.id}`}>{todo.description}</Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
