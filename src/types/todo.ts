export interface ITodo {
  id: number;
  description: string;
  status: "pending" | "in_progress" | "done";
  created_at: string;
}
