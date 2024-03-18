import { Task } from "../models/Task";
import { moks as rawMocks } from "../moks/moks";

let moks = rawMocks;

// функция должна возвращать Promise, который вернет значение через заданное кол-во ms
// перенести хелпер в папку utils
const resolveWithValue = <T>(data: T, ms: number): Promise<T> => {
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

    return resolveWithValue<TResponse<Task[]>>({ data: moks }, 1000);
  }

  async getById(id: string) {
    // return axios.get<Task>(`${this.URL}/${id}`);
    const task = moks.find((task) => task.id === id);

    if (!task) {
      return rejectWithValue("Task not found", 1000);
    }

    return resolveWithValue<TResponse<Task[]>>({ data: moks }, 1000);
  }

  async deleteTask(id: string) {
    // починить сравнение
    moks = moks.filter((task) => task.id !== id);

    return resolveWithValue({ status: 200 }, 1000);
  }

  // сделать параметры обьектом
  async addTask(id: string, description: string, isDone: boolean) {
    const newTask: Task = {
      id,
      description,
      isDone: false,
    };

    const addTask = moks.push(newTask);

    return resolveWithValue({ data: newTask, status: 200 }, 1000);
  }
}

export default new TodosService();
