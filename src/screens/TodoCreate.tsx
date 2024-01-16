import TextareaWithValidation from "../components/TextareaWithValidation";
import useTodo from "../hooks/useTodo";

const TodoCreate = (): JSX.Element => {
  const {
    editableDescription,
    isDescriptionValid,
    handleEditableDescriptionChange,
    handleDescriptionBlur,
    handleSaveChanges,
    handleKeyDown,
    handleCancel,
  } = useTodo();

  return (
    <div className="container flex flex-col mx-4 p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold mb-4">Add new Todo</h1>
      </div>
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
          <button
            onClick={handleCancel}
            type="button"
            className="bg-gray-100 mr-2 px-4 py-2 rounded-md transition duration-300 hover:bg-gray-200 hover:shadow-md inline-block"
          >
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
        </div>
      </form>
    </div>
  );
};

export default TodoCreate;
