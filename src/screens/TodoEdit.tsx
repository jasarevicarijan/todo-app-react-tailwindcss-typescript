import { Link } from "react-router-dom";
import TextareaWithValidation from "../components/TextareaWithValidation";
import useTodo from "../hooks/useTodo";
import { TodoStatus } from "../enums/status";

export default function TodoEdit(): JSX.Element {
  const {
    todo,
    editableDescription,
    isDescriptionValid,
    handleEditableDescriptionChange,
    handleDescriptionBlur,
    handleStageChange,
    handleSaveChanges,
    handleKeyDown,
    handleDeleteTodo,
  } = useTodo();

  const renderStatusButtons = () => {
    if (!todo) return;

    if (todo.status === TodoStatus.Pending) {
      return (
        <button
          onClick={() => handleStageChange("in_progress")}
          className="bg-yellow-500 text-white px-4 py-2 rounded-md transition duration-300 ease-in-out hover:bg-yellow-600 hover:shadow-md mr-2 inline-block"
        >
          Move to In Progress
        </button>
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
            <TextareaWithValidation
              value={editableDescription}
              onChange={handleEditableDescriptionChange}
              onBlur={handleDescriptionBlur}
              onKeyDown={handleKeyDown}
              isDescriptionValid={isDescriptionValid}
              placeholder="Enter todo description."
              minCharacters={10}
              maxCharacters={255}
            />
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
