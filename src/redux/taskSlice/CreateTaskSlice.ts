import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Filter, InitialStateTask } from "../../models/InitialTask";
import { Task } from "../../models/Task";

type AddTaskPayload = {
  description: string;
};

const initialState: InitialStateTask = {
  tasks: {
    allIds: [],
    byId: {},
  },
  filter: "all",
};

export const CreateTaskSlice = createSlice({
  name: "todoTasks",
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<AddTaskPayload>) => {
      const { description } = action.payload;

      const id = String(Math.floor(Math.random() * 10000000));

      const newTask: Task = {
        id,
        description,
        isDone: false,
      };

      state.tasks.byId[id] = newTask;
      state.tasks.allIds.push(newTask.id);
    },
    removeTask: (state, action: PayloadAction<string>) => {
      const idToRemove = action.payload;

      state.tasks.allIds = state.tasks.allIds.filter(
        (task) => task !== idToRemove
      );
      delete state.tasks.byId[idToRemove];
    },
    editTask: (state, action: PayloadAction<Task>) => {
      const { id, description } = action.payload;

      const taskToEdit = state.tasks.byId[id];
      if (taskToEdit) {
        taskToEdit.description = description;
      }
    },
    // switchIsDone: (state, action: PayloadAction<{ id: number }>) => {
    //   const { id } = action.payload;

    //   const taskAsDone = state.tasks.byId[id];
    //   if (taskAsDone) {
    //     taskAsDone.isDone = !taskAsDone.isDone;
    //   }
    // },
    setFilterValueAC: (state, action: PayloadAction<Filter>) => {
      state.filter = action.payload;
    },
  },
});

export const { addTask, removeTask, editTask, setFilterValueAC } =
  CreateTaskSlice.actions;
