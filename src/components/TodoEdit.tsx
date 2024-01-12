import { useState, useEffect } from "react";
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
  const [isDescriptionValid, setIsDescriptionValid] = useState<boolean>(true);

  useEffect(() => {
    // Load the todo based on the ID from the URL params
    const existingTodos: ITodo[] = JSON.parse(
      localStorage.getItem("todos") || "[]"
    );
    const selectedTodo = existingTodos.find((t) => t.id.toString() === todo_id);

    if (selectedTodo) {
      setTodo(selectedTodo);
      setEditableDescription(selectedTodo.description);
    } else {
      navigate("/todo/list"); // Redirect to the list if todo is not found
    }
  }, [todo_id, navigate]);

  const handleEditableDescriptionChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setEditableDescription(event.target.value);
    // Remove validation on each change
    setIsDescriptionValid(true);
  };

  const handleDescriptionBlur = () => {
    // Validate the description onBlur
    setIsDescriptionValid(
      editableDescription.length >= 10 && editableDescription.length <= 255
    );
  };

  const handleStageChange = (newStatus: string) => {
    if (todo) {
      const existingTodos: ITodo[] = JSON.parse(
        localStorage.getItem("todos") || "[]"
      );

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
        setTodo((prevTodo: ITodo | null) => {
          if (prevTodo) {
            return {
              ...prevTodo,
              status: newStatus as "pending" | "in_progress" | "done", // Type assertion
            };
          }
          return null;
        });

        // Redirect back to the list screen after updating
        navigate("/todo/list");
      }
    }
  };

  const handleSaveChanges = (event: React.FormEvent) => {
    event.preventDefault();

    if (!isDescriptionValid) {
      alert("Description must be between 10 and 255 characters.");
      return;
    }
    if (todo) {
      const existingTodos: ITodo[] = JSON.parse(
        localStorage.getItem("todos") || "[]"
      );

      const updatedTodos = existingTodos.map((t) =>
        t.id === todo.id ? { ...t, description: editableDescription } : t
      );

      localStorage.setItem("todos", JSON.stringify(updatedTodos));
      setTodo((prevTodo: ITodo | null) => {
        if (prevTodo) {
          return {
            ...prevTodo,
            description: editableDescription,
          };
        }
        return null;
      });

      // Redirect back to the list screen after saving changes
      navigate("/todo/list");
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter") {
      handleSaveChanges(event);
    }
  };

  const handleDeleteTodo = () => {
    if (todo) {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this todo?"
      );
      if (confirmDelete) {
        const existingTodos: ITodo[] = JSON.parse(
          localStorage.getItem("todos") || "[]"
        );

        const updatedTodos = existingTodos.filter((t) => t.id !== todo.id);
        localStorage.setItem("todos", JSON.stringify(updatedTodos));

        navigate("/todo/list");
      }
    }
  };

  const handleCancel = () => {
    window.history.back();
  };

  return (
    <div className="container flex flex-col mx-4 p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold mb-4">Edit Todo</h1>
      </div>
      {todo ? (
        <div>
          <form className="flex flex-col" onSubmit={handleSaveChanges}>
            <textarea
              value={editableDescription}
              onChange={handleEditableDescriptionChange}
              placeholder="Enter todo description."
              onBlur={handleDescriptionBlur}
              onKeyDown={handleKeyDown}
              className={`px-3 py-2 border border-gray-300 rounded-md mb-4 resize-none ${
                !isDescriptionValid && "border-red-500"
              }`}
              rows={4}
            ></textarea>
            {!isDescriptionValid && (
              <p className="text-red-500 mb-2">
                Description must be between 10 and 255 characters.
              </p>
            )}
            <div className="flex justify-end">
              {" "}
              <button onClick={handleCancel} type="button" className="bg-gray-100 mr-2 px-4 py-2 rounded-md transition duration-300 hover:bg-gray-200 hover:shadow-md inline-block">
                Cancel
              </button>
              <button
                type="submit"
                disabled={!isDescriptionValid}
                className={`bg-blue-500 text-white px-4 py-2 rounded-md transition duration-300 ease-in-out hover:bg-blue-600 hover:shadow-md mr-2 inline-block ${
                  !isDescriptionValid && "opacity-50 cursor-not-allowed"
                }`}
              >
                Save Todo
              </button>
              {todo.status === "pending" && (
                <>
                  <button
                    onClick={() => handleStageChange("in_progress")}
                    className="bg-yellow-500 text-white px-4 py-2 rounded-md transition duration-300 ease-in-out hover:bg-yellow-600 hover:shadow-md mr-2 inline-block"
                  >
                    Move to In Progress
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
                onClick={handleDeleteTodo}
                className="bg-red-500 text-white px-4 py-2 rounded-md transition duration-300 ease-in-out hover:bg-red-600 hover:shadow-md inline-block"
              >
                Delete Todo
              </button>
            </div>
          </form>
        </div>
      ) : (
        <p>Todo not found.</p>
      )}
    </div>
  );
}
