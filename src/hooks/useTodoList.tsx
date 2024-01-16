import { useEffect, useState, useMemo } from "react";
import { ITodo } from "../types/todo";
import { TTodoStatus } from "../enums/status";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const debounce = (func: (...args: any[]) => void, delay: number) => {
  let timeoutId: ReturnType<typeof setTimeout>;

  return (...args: unknown[]) => {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

export const useTodoList = () => {
  const [todos, setTodos] = useState<ITodo[]>([]);
  const [filteredTodos, setFilteredTodos] = useState<ITodo[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const search = debounce((term: string) => {
    const filtered = todos.filter((todo) => todo.description.includes(term));
    setFilteredTodos(filtered);
  }, 250);

  useEffect(() => {
    const storedTodos = JSON.parse(
      localStorage.getItem("todos") || "[]"
    ) as ITodo[];
    setTodos(storedTodos);
  }, []);

  useEffect(() => {
    search(searchTerm);
  }, [search, searchTerm, todos]);

  const groupTodosByStatus = useMemo(() => {
    const statusMap: Record<TTodoStatus, ITodo[]> = {
      pending: [],
      in_progress: [],
      done: [],
    };

    filteredTodos.forEach((todo) => {
      statusMap[todo.status].push(todo);
    });

    return statusMap;
  }, [filteredTodos]);

  return {
    searchTerm,
    setSearchTerm,
    columns: groupTodosByStatus,
  };
};
