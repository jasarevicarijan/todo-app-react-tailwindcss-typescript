import { useEffect, useState } from "react";
import { ITodo } from "../types/todo";
import { TTodoStatus } from "../enums/status";
import { useDebounce } from "../hooks/useDebounce";


export const useTodoList = () => {
  const [todos, setTodos] = useState<ITodo[]>([]);
  const [filteredTodos, setFilteredTodos] = useState<ITodo[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    const storedTodos = JSON.parse(
      localStorage.getItem("todos") || "[]"
    ) as ITodo[];
    setTodos(storedTodos);
    setFilteredTodos(storedTodos);
  }, []);

  useEffect(() => {
    const filtered = todos.filter((todo) =>
      todo.description.includes(debouncedSearchTerm)
    );
    setFilteredTodos(filtered);
  }, [todos, searchTerm, debouncedSearchTerm]);

  const groupTodosByStatus = (todos: ITodo[]): Record<TTodoStatus, ITodo[]> => {
    const statusMap: Record<TTodoStatus, ITodo[]> = {
      pending: [],
      in_progress: [],
      done: [],
    };

    todos.forEach((todo) => {
      statusMap[todo.status].push(todo);
    });

    return statusMap;
  };

  const columns = groupTodosByStatus(filteredTodos);

  return {
    todos,
    filteredTodos,
    searchTerm,
    setSearchTerm,
    columns,
  };
};
