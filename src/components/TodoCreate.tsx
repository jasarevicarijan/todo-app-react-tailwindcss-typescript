import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ITodo } from "../types/todo";
import dayjs from "dayjs";
import "dayjs/locale/hr"; // Import Croatian locale

export default function TodoCreate(): JSX.Element {
  const [description, setDescription] = useState<string>("");
  const [isDescriptionValid, setIsDescriptionValid] = useState<boolean>(true);
  const navigate = useNavigate();

  const handleDescriptionChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setDescription(event.target.value);
    // Remove validation on each change
    setIsDescriptionValid(true);
  };

  const handleDescriptionBlur = () => {
    // Validate the description onBlur
    setIsDescriptionValid(
      description.length >= 10 && description.length <= 255
    );
  };

  const handleSaveTodo = (event: React.FormEvent) => {
    event.preventDefault();

    // Check if description is valid before saving
    if (!isDescriptionValid) {
      alert("Description must be between 10 and 255 characters.");
      return;
    }

    // Create new Todo and generate random id
    const newTodo: ITodo = {
      id: new Date().getTime() - Math.floor(Math.random() * 1000),
      description,
      status: "pending",
      created_at: dayjs().locale("hr").format("D. MMMM YYYY."),
    };

    // Save the new todo to local storage
    const existingTodos: ITodo[] = JSON.parse(
      localStorage.getItem("todos") || "[]"
    );
    const updatedTodos = [...existingTodos, newTodo];
    localStorage.setItem("todos", JSON.stringify(updatedTodos));

    // Redirect back to the todo list after saving
    navigate("/todo/list");
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter") {
      handleSaveTodo(event);
    }
  };

  const handleCancel = () => {
    window.history.back();
  };

  return (
    <div className="container flex flex-col mx-4 p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold mb-4">Add new Todo</h1>
      </div>
      <form className="flex flex-col" onSubmit={handleSaveTodo}>
        <textarea
          value={description}
          onChange={handleDescriptionChange}
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
}
