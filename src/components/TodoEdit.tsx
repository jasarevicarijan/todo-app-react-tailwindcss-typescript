import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ITodo } from "../types/todo";

type TodoEditParams = {
  todo_id: string;
};

export default function TodoEdit(): JSX.Element {
  const { todo_id } = useParams<TodoEditParams>();
  const navigate = useNavigate();

  const [todo, setTodo] = useState<ITodo | null>(null);
  const [editableDescription, setEditableDescription] = useState<string>("");

  useEffect(() => {
    // Load the todo based on the ID from the URL params
    const existingTodos: ITodo[] = JSON.parse(localStorage.getItem("todos") || "[]");
    const selectedTodo = existingTodos.find((t) => t.id.toString() === todo_id);

    if (selectedTodo) {
      setTodo(selectedTodo);
      setEditableDescription(selectedTodo.description);
    } else {
      navigate("/todo/list"); // Redirect to the list if todo is not found
    }
  }, [todo_id, navigate]);

  const handleStageChange = (newStatus: string) => {
    if (todo) {
      const existingTodos: ITodo[] = JSON.parse(localStorage.getItem("todos") || "[]");

      // Check if there is already a todo in "in_progress"
      const isInProgress = existingTodos.some(
        (t) => t.status === "in_progress" && t.id !== todo.id
      );

      if (isInProgress && newStatus === "in_progress") {
        alert("There can only be one todo in 'in_progress' at a time.");
      } else {
        // Toggle the status between "pending", "in_progress", and "done"
        const updatedTodos = existingTodos.map((t) =>
          t.id === todo.id ? { ...t, status: newStatus } : t
        );

        localStorage.setItem("todos", JSON.stringify(updatedTodos));
        setTodo((prevTodo) =>
          prevTodo ? { ...prevTodo, status: newStatus } : null
        );

        // Redirect back to the list screen after updating
        navigate("/todo/list");
      }
    }
  };

  const handleSaveChanges = () => {
    if (todo) {
      const existingTodos: ITodo[] = JSON.parse(localStorage.getItem("todos") || "[]");

      const updatedTodos = existingTodos.map((t) =>
        t.id === todo.id ? { ...t, description: editableDescription } : t
      );

      localStorage.setItem("todos", JSON.stringify(updatedTodos));
      setTodo((prevTodo) =>
        prevTodo ? { ...prevTodo, description: editableDescription } : null
      );

      // Redirect back to the list screen after saving changes
      navigate("/todo/list");
    }
  };

  const handleDeleteTodo = () => {
    if (todo) {
      const confirmDelete = window.confirm("Are you sure you want to delete this todo?");
      if (confirmDelete) {
        const existingTodos: ITodo[] = JSON.parse(localStorage.getItem("todos") || "[]");

        const updatedTodos = existingTodos.filter((t) => t.id !== todo.id);
        localStorage.setItem("todos", JSON.stringify(updatedTodos));

        navigate("/todo/list");
      }
    }
  };

  return (
    <div className="container flex flex-col mx-4 p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold mb-4">Edit Todo</h1>
      </div>
      {todo ? (
        <div>
          <input
            type="text"
            value={editableDescription}
            onChange={(e) => setEditableDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4"
          />
          <div className="flex justify-between mb-4">
            <p className="text-sm mt-2">{`Status: ${todo.status}`}</p>
            <p className="text-sm mt-2">{`Created at: ${todo.created_at}`}</p>
          </div>
          <div className="flex justify-between">
            {todo.status === "pending" && (
              <>
                <button
                  onClick={() => handleStageChange("in_progress")}
                  className="bg-yellow-500 text-white px-4 py-2 rounded-md transition duration-300 ease-in-out hover:bg-yellow-600 hover:shadow-md mr-2 inline-block"
                >
                  Move to In Progress
                </button>
                <button
                  onClick={() => handleStageChange("done")}
                  className="bg-green-500 text-white px-4 py-2 rounded-md transition duration-300 ease-in-out hover:bg-green-600 hover:shadow-md mr-2 inline-block hidden"
                >
                  Mark as Done
                </button>
              </>
            )}
            {todo.status === "in_progress" && (
              <button
                onClick={() => handleStageChange("done")}
                className="bg-green-500 text-white px-4 py-2 rounded-md transition duration-300 ease-in-out hover:bg-green-600 hover:shadow-md mr-2 inline-block"
              >
                Mark as Done
              </button>
            )}
            <button
              onClick={handleSaveChanges}
              className="bg-blue-500 text-white px-4 py-2 rounded-md transition duration-300 ease-in-out hover:bg-blue-600 hover:shadow-md mr-2 inline-block"
            >
              Save Changes
            </button>
            <button
              onClick={handleDeleteTodo}
              className="bg-red-500 text-white px-4 py-2 rounded-md transition duration-300 ease-in-out hover:bg-red-600 hover:shadow-md inline-block"
            >
              Delete Todo
            </button>
          </div>
        </div>
      ) : (
        <p>Todo not found.</p>
      )}
    </div>
  );
}