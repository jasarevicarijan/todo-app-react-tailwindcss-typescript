import { Link } from "react-router-dom";
import TodoFilter from "../components/TodoFilter";
import { useTodoList } from "../hooks/useTodoList";
import ItemColumn from "../components/ItemColumn";

export default function TodoList(): JSX.Element {
  const { columns, setSearchTerm } = useTodoList();

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
        <ItemColumn title="Pending" itemList={columns.pending} />
        <ItemColumn title="In progress" itemList={columns.in_progress} />
        <ItemColumn title="Done" itemList={columns.done} />
      </div>
    </div>
  );
}
