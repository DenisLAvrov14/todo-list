import { Task } from "./Task";

export type InitialStateTask = {
  tasks: {
    allIds: number[];
    byId: Record<number, Task>;
  };
};

const qwe = {
  asd: "asd",
};

const computedKey = "asd";

const asd = qwe[computedKey];
