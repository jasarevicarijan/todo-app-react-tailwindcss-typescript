import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ITodo } from "../types/todo";
import { TTodoStatus, TodoStatus } from "../enums/status";

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
    const existingTodos: ITodo[] = JSON.parse(
      localStorage.getItem("todos") || "[]"
    );
    const selectedTodo = existingTodos.find((t) => t.id.toString() === todo_id);

    if (!selectedTodo) {
      console.log("No todos found");
      return;
    }

    setTodo(selectedTodo);
    setEditableDescription(selectedTodo.description);
  }, [todo_id]);

  const handleEditableDescriptionChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setEditableDescription(event.target.value);
    setIsDescriptionValid(true);
  };

  const handleDescriptionBlur = () => {
    setIsDescriptionValid(
      editableDescription.length >= 10 && editableDescription.length <= 255
    );
  };

  const handleStageChange = (newStatus: TTodoStatus) => {
    if (!todo) {
      return;
    }

    const existingTodos: ITodo[] = JSON.parse(
      localStorage.getItem("todos") || "[]"
    );

    const isInProgress = existingTodos.some(
      (t) => t.status === TodoStatus.InProgress && t.id !== todo.id
    );

    if (isInProgress && newStatus === TodoStatus.InProgress) {
      alert("There can only be one todo in 'in_progress' at a time.");
      return;
    }

    const updatedTodos = existingTodos.map((t) =>
      t.id === todo.id ? { ...t, status: newStatus } : t
    );

    localStorage.setItem("todos", JSON.stringify(updatedTodos));
    setTodo((prevTodo: ITodo | null) => {
      if (prevTodo) {
        return {
          ...prevTodo,
          status: newStatus as TTodoStatus,
        };
      }
      return null;
    });

    navigate("/todo/list");
  };

  const handleSaveChanges = (event: React.FormEvent) => {
    event.preventDefault();

    if (!isDescriptionValid) {
      alert("Description must be between 10 and 255 characters.");
      return;
    }

    if (!todo) {
      return;
    }

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

    navigate("/todo/list");
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter") {
      handleSaveChanges(event);
    }
  };

  const handleDeleteTodo = () => {
    if (!todo) {
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this todo?"
    );

    if (!confirmDelete) {
      return;
    }

    const existingTodos: ITodo[] = JSON.parse(
      localStorage.getItem("todos") || "[]"
    );

    const updatedTodos = existingTodos.filter((t) => t.id !== todo.id);
    localStorage.setItem("todos", JSON.stringify(updatedTodos));

    navigate("/todo/list");
  };

  const handleCancel = () => {
    window.history.back();
  };

  const renderStatusButtons = () => {
    if (!todo) return;

    if (todo.status === TodoStatus.Pending) {
      return (
        <>
          <button
            onClick={() => handleStageChange("in_progress")}
            className="bg-yellow-500 text-white px-4 py-2 rounded-md transition duration-300 ease-in-out hover:bg-yellow-600 hover:shadow-md mr-2 inline-block"
          >
            Move to In Progress
          </button>
        </>
      );
    } else if (todo.status === TodoStatus.InProgress) {
      return (
        <button
          onClick={() => handleStageChange("done")}
          className="bg-green-500 text-white px-4 py-2 rounded-md transition duration-300 ease-in-out hover:bg-green-600 hover:shadow-md mr-2 inline-block"
        >
          Mark as Done
        </button>
      );
    }
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
            <div className="flex justify-between">
              <div>
                <button
                  onClick={handleCancel}
                  type="button"
                  className="bg-gray-100 mr-2 px-4 py-2 rounded-md transition duration-300 hover:bg-gray-200 hover:shadow-md inline-block"
                >
                  Cancel
                </button>
              </div>
              <div>
                <button
                  type="submit"
                  disabled={!isDescriptionValid}
                  className={`bg-blue-500 text-white px-4 py-2 rounded-md transition duration-300 ease-in-out hover:bg-blue-600 hover:shadow-md mr-2 inline-block ${
                    !isDescriptionValid && "opacity-50 cursor-not-allowed"
                  }`}
                >
                  Save Todo
                </button>
                {renderStatusButtons()}
                <button
                  onClick={handleDeleteTodo}
                  className="bg-red-500 text-white px-4 py-2 rounded-md transition duration-300 ease-in-out hover:bg-red-600 hover:shadow-md inline-block"
                >
                  Delete Todo
                </button>
              </div>
            </div>
          </form>
        </div>
      ) : (
        <div className="flex h-screen">
          <div className="m-auto">
            <p className="flx flex-col justify-center items-center basis-full">
              No Todo found.{" "}
              <Link to="/todo/list" className="text-blue-500">
                Go back?
              </Link>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
