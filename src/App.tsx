import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import TodoList from "./components/TodoList";
import TodoCreate from "./components/TodoCreate";
import TodoEdit from "./components/TodoEdit";

import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/todo/list" element={<TodoList />} />
        <Route path="/todo/create" element={<TodoCreate />} />
        <Route path="/todo/edit/:todo_id" element={<TodoEdit />} />
        <Route path="/" element={<Navigate to="/todo/list" />} />
      </Routes>
    </Router>
  );
}

export default App;