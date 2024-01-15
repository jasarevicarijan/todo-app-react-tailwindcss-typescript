import { useMemo } from "react";
import { ITodo } from "../types/todo";
import { TodoStatus } from "../enums/status";

type TTodoItemProps = {
  todo: ITodo;
};

const TodoItem = ({ todo }: TTodoItemProps) => {
  const getStatusColor = useMemo(() => {
    switch (todo.status) {
      case TodoStatus.Pending:
        return "bg-red-200";
      case TodoStatus.InProgress:
        return "bg-yellow-200";
      case TodoStatus.Done:
        return "bg-green-200";
      default:
        throw new Error(`Unexpected status: ${todo.status}`);
    }
  }, [todo.status]);

  const formatDate = (timestamp: number) => {
    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      timeZone: "Europe/Zagreb",
    };

    const croatianDateFormat = new Intl.DateTimeFormat("hr-HR", options);
    return croatianDateFormat.format(new Date(timestamp));
  };

  return (
    <div
      className={`p-4 rounded-md shadow-md ${getStatusColor} mb-4 transition duration-300 ease-in-out hover:bg-blue-100`}
    >
      <p className="text-lg font-semibold text-left break-all">
        {todo.description}
      </p>
      <div className="flex justify-between">
        <p className="text-sm mt-2">{`Status: ${todo.status}`}</p>
        <p className="text-sm mt-2">{`Created at: ${formatDate(
          todo.created_at
        )}`}</p>
      </div>
    </div>
  );
};

export default TodoItem;
