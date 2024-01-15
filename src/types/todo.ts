import { TTodoStatus } from "../enums/status";
export interface ITodo {
  id: number;
  description: string;
  status: TTodoStatus;
  created_at: number;
}
