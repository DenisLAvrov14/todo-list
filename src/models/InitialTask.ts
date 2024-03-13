import { useCallback } from "react";
import { Task } from "./Task";

export type InitialStateTask = {
  tasks: {
    allIds: string[];
    byId: Record<string, Task>;
  };
  filter: Filter;
};

export type Filter = "all" | "done" | "undone";

// export type Note = {
//   pole: string;
// };

// const sss: string = "";
