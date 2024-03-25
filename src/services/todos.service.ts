import { Task } from "../models/Task";
import { mocks as rawMocks } from "../moks/moks";

let mocks = rawMocks;

// перенести хелпер в папку utils
export const resolveWithValue = <T>(data: T, ms: number): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, ms);
  });
};
const rejectWithValue = <T>(data: T, ms: number): Promise<T> => {
  return new Promise((reject) => {
    setTimeout(() => {
      reject(data);
    }, ms);
  });
};

const resolved = async () => {
  await resolveWithValue(true, 1500);
};

resolved();

const rejected = async () => {
  try {
    await rejectWithValue("Error occurred", 1500);
  } catch (error) {
    console.error("Error occurred: ", error);
  }
};

rejected();

// type DataTasks2<T = Task[]> = {data: T}

type TResponse<T> = { data: T };

class TodosService {
  // private URL = "http://localhost:3000/";

  async getAll() {
    // return axios.get<Task[]>(`${this.URL}/todos`);

    return resolveWithValue<TResponse<Task[]>>({ data: mocks }, 1000);
  }

  async getById(id: string) {
    // return axios.get<Task>(`${this.URL}/${id}`);
    const task = mocks.find((task) => task.id === id);

    if (!task) {
      return rejectWithValue("Task not found", 1000);
    }

    return resolveWithValue<TResponse<Task[]>>({ data: mocks }, 1000);
  }

  async deleteTask(id: string) {
    mocks = mocks.filter((task) => task.id !== id);

    return resolveWithValue({ status: 200 }, 1000);
  }

  async addTask(task: { id: string; description: string; isDone: boolean }) {
    const newTask: Task = {
      id: task.id,
      description: task.description,
      isDone: false,
    };

    const addTask = mocks.push(newTask);

    return resolveWithValue({ data: newTask, status: 200 }, 1000);
  }

  async taskIsDone(id: string) {
    const taskIndex = mocks.findIndex((task) => task.id === id);
    if (taskIndex !== -1) {
      mocks[taskIndex].isDone = true;

      return resolveWithValue<TResponse<Task[]>>({ data: mocks }, 1000);
    }
  }

  // editTask, taskIsDone, save добавить
}

export default new TodosService();
