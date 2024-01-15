import { ITodo } from "../types/todo";
import TodoItem from "./TodoItem";
import { Link } from "react-router-dom";

type IProps = {
  title: string;
  itemList: ITodo[];
};

const ItemColumn = ({ title, itemList }: IProps) => {
  return (
    <div className="border rounded-md p-4 h-full bg-gray-50">
      <h2 className="text-lg font-bold mb-2">
        {title
          .split("_")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")}
      </h2>
      {itemList.length === 0 ? (
        <p>No todos found.</p>
      ) : (
        <ul>
          {itemList.map((todo) => (
            <li key={todo.id}>
              <Link
                to={`/todo/edit/${todo.id}`}
                className="text-gray-900 hover:no-underline"
              >
                <TodoItem todo={todo} />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ItemColumn;
