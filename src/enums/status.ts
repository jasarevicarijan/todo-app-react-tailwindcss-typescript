export const TodoStatus = {
    Pending: "pending",
    InProgress: "in_progress",
    Done: "done"
} as const;

export type TTodoStatus = (typeof TodoStatus)[keyof typeof TodoStatus];