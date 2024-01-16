import React from "react";
import { useTodoList } from "../hooks/useTodoList";

type TTodoFilterProps = {
  onSearchTermChange: (value: string) => void;
};

const TodoFilter = ({ onSearchTermChange }: TTodoFilterProps) => {
  const { searchTerm, setSearchTerm } = useTodoList();


  const handleSearchTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    onSearchTermChange(e.target.value);
  };

  return (
    <div className="mb-4">
      <input
        type="text"
        placeholder="Search by description"
        value={searchTerm}
        onChange={handleSearchTermChange}
        className="px-3 py-2 border border-gray-300 rounded-md mr-2 w-full"
      />
    </div>
  );
};

export default TodoFilter;
