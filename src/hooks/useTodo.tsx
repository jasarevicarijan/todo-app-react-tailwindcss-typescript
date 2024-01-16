import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ITodo } from "../types/todo";
import { TTodoStatus, TodoStatus } from "../enums/status";

type TodoEditParams = {
  todo_id: string;
};

const useTodo = () => {
  const { todo_id } = useParams<TodoEditParams>();
  const navigate = useNavigate();

  const [todo, setTodo] = useState<ITodo | null>(null);
  const [editableDescription, setEditableDescription] = useState<string>("");
  const [isDescriptionValid, setIsDescriptionValid] = useState<boolean>(true);
  const [isCreating, setIsCreating] = useState<boolean>(false);

  useEffect(() => {
    if (todo_id) {
      // Editing an existing todo
      const existingTodos: ITodo[] = JSON.parse(
        localStorage.getItem("todos") || "[]"
      );
      const selectedTodo = existingTodos.find(
        (t) => t.id.toString() === todo_id
      );

      if (!selectedTodo) {
        console.log("No todos found for id:", todo_id);
        return;
      }

      setTodo(selectedTodo);
      setEditableDescription(selectedTodo.description);
    } else {
      // Creating a new todo
      setIsCreating(true);
    }
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

    const existingTodos: ITodo[] = JSON.parse(
      localStorage.getItem("todos") || "[]"
    );

    if (isCreating) {
      // Creating a new todo
      const newTodo: ITodo = {
        id: new Date().getTime(),
        description: editableDescription,
        status: TodoStatus.Pending,
        created_at: Date.now(),
      };

      const updatedTodos = [...existingTodos, newTodo];
      localStorage.setItem("todos", JSON.stringify(updatedTodos));
      navigate("/todo/list");
    } else {
      // Editing an existing todo
      if (!todo) {
        return;
      }
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
    }
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

  return {
    todo,
    editableDescription,
    isDescriptionValid,
    isCreating,
    handleEditableDescriptionChange,
    handleDescriptionBlur,
    handleStageChange,
    handleSaveChanges,
    handleKeyDown,
    handleDeleteTodo,
  };
};

export default useTodo;
