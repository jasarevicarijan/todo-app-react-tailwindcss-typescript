import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ITodo } from "../types/todo";
import { TTodoStatus, TodoStatus } from "../enums/status";
import TodoFilter from "../components/TodoFilter";
import { useDebounce } from "../hooks/useDebounce";
import ItemColumn from "../components/ItemColumn";

export default function TodoList(): JSX.Element {
  const [todos, setTodos] = useState<ITodo[]>([]);
  const [filteredTodos, setFilteredTodos] = useState<ITodo[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    const storedTodos = JSON.parse(
      localStorage.getItem("todos") || "[]"
    ) as ITodo[];

    const groupedTodos = groupTodosByStatus(storedTodos);
    setTodos(groupedTodos);
    setFilteredTodos(groupedTodos);
  }, []);

  useEffect(() => {
    const filtered = todos.filter((todo) =>
      todo.description.includes(debouncedSearchTerm)
    );
    setFilteredTodos(filtered);
  }, [todos, debouncedSearchTerm]);

  const groupTodosByStatus = (todos: ITodo[]): ITodo[] => {
    const statusMap: Record<TTodoStatus, ITodo[]> = {
      [TodoStatus.Pending]: [],
      [TodoStatus.InProgress]: [],
      [TodoStatus.Done]: [],
    };
  
    // Populate statusMap using reduce
    todos.reduce((accumulator, todo) => {
      const status = todo.status as TTodoStatus;
      accumulator[status].push(todo);
      return accumulator;
    }, statusMap);
  
    // Flatten the statusMap into groupedTodos
    const groupedTodos = Object.values(statusMap).flat();
  
    return groupedTodos;
  };  

  const columns: Record<TTodoStatus, ITodo[]> = {
    [TodoStatus.Pending]: filteredTodos.filter(
      (todo) => todo.status === TodoStatus.Pending
    ),
    [TodoStatus.InProgress]: filteredTodos.filter(
      (todo) => todo.status === TodoStatus.InProgress
    ),
    [TodoStatus.Done]: filteredTodos.filter(
      (todo) => todo.status === TodoStatus.Done
    ),
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold mb-4">Todo Planner</h1>
        <Link to="/todo/create" className="text-blue-500">
          <button className="bg-blue-500 text-white px-4 py-2 mb-2 rounded-md transition duration-300 ease-in-out hover:bg-blue-600 hover:shadow-md">
            Add new Todo
          </button>
        </Link>
      </div>

      <TodoFilter onSearchTermChange={setSearchTerm} />

      <div className="grid grid-cols-3 gap-4">
        {Object.entries(columns).map(([status, items]) => (
          <ItemColumn key={status} title={status} itemList={items} />
        ))}
      </div>
    </div>
  );
}
