import { Task } from "./Task";

export type InitialStateTask = {
  tasks: {
    allIds: number[];
    byId: Record<number, Task>;
  };
  filter: Filter;
};

export type Filter = "all" | "done" | "undone";
