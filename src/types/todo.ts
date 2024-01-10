export interface ITodo {
  id: string;
  description: string;
  status: "pending" | "in_progress" | "done";
  created_at: string;
}
