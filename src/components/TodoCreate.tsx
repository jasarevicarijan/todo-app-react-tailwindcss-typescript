import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ITodo } from "../types/todo";
import dayjs from 'dayjs';
import 'dayjs/locale/hr'; // Import Croatian locale

export default function TodoCreate(): JSX.Element {
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  const handleDescriptionChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setDescription(event.target.value);
  };

  const handleSaveTodo = () => {
    // Create new Todo and generate random id
    const newTodo: ITodo = {
      id: new Date().getTime() - Math.floor(Math.random() * 1000),
      description,
      status: "pending",
      created_at: dayjs().locale('hr').format('D. MMMM YYYY.'),
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

  // Validate description length to enable/disable the save button
  const isDescriptionValid =
    description.length >= 10 && description.length <= 255;

  return (
    <div className="container flex flex-col mx-4 p-4">
      <form className="flex flex-col">
        <textarea
          value={description}
          onChange={handleDescriptionChange}
          placeholder="Enter todo description (between 10 and 255 characters)."
          className="px-3 py-2 border border-gray-300 rounded-md mb-4 resize-none"
          rows={4}
        ></textarea>
        <div className="flex justify-end"> {/* Use flex and justify-end */}
          <button
            onClick={handleSaveTodo}
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
