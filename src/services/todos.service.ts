import axios from 'axios';

const API_URL = 'http://localhost:3001';

export const getTodos = async () => {
  try {
    const response = await axios.get(`${API_URL}/todos`);
    return response.data;
  } catch (error) {
    console.error('Error fetching todos:', error);
    throw error;
  }
};

export const addTodo = async (description: string, is_done: boolean) => {
  try {
    const response = await axios.post(`${API_URL}/tasks`, { description, is_done });
    return response.data;
  } catch (error) {
    console.error('Error adding todo:', error);
    throw error;
  }
};

export const updateTodo = async (id: number, task: string, completed: boolean) => {
  try {
    const response = await axios.put(`${API_URL}/todos/${id}`, { task, completed });
    return response.data;
  } catch (error) {
    console.error('Error updating todo:', error);
    throw error;
  }
};

export const deleteTodo = async (id: number) => {
  try {
    await axios.delete(`${API_URL}/todos/${id}`);
  } catch (error) {
    console.error('Error deleting todo:', error);
    throw error;
  }
};

// Новые функции для взаимодействия с пользователями, задачами и временем выполнения задач
export const createUser = async (username: string, email: string) => {
  try {
    const response = await axios.post(`${API_URL}/users`, { username, email });
    return response.data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const createTask = async (id: number, description: string) => {
  try {
    const response = await axios.post(`${API_URL}/tasks`, { id, description });
    return response.data;
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
};

export const createTaskTime = async (taskId: number, startTime: Date, endTime: Date, duration: number) => {
  const startTimeFormatted = startTime.toISOString().slice(0, 19).replace('T', ' ');
  const endTimeFormatted = endTime.toISOString().slice(0, 19).replace('T', ' ');

  try {
    const response = await axios.post(`${API_URL}/task_times`, { task_id: taskId, start_time: startTimeFormatted, end_time: endTimeFormatted, duration });
    return response.data;
  } catch (error) {
    console.error('Error creating task time:', error);
    throw error;
  }
};

export const getTaskTimes = async (userId: number) => {
  try {
    const response = await axios.get(`${API_URL}/task_times/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error getting task times:', error);
    throw error;
  }
};

// Новые методы
export const taskIsDone = async (taskId: number) => {
  try {
    const response = await axios.put(`${API_URL}/tasks/${taskId}/done`);
    return response.data;
  } catch (error) {
    console.error('Error marking task as done:', error);
    throw error;
  }
};

export const saveTaskTime = async (taskId: number, userId: number, startTime: Date, endTime: Date, duration: number) => {
  try {
    const response = await axios.post(`${API_URL}/task_times`, {
      task_id: taskId,
      user_id: userId,
      start_time: startTime,
      end_time: endTime,
      duration: duration
    });
    return response.data;
  } catch (error) {
    console.error('Error saving task time:', error);
    throw error;
  }
};


// Экспортируем объект по умолчанию
const todosService = {
  getTodos,
  addTodo,
  updateTodo,
  deleteTodo,
  createUser,
  createTask,
  createTaskTime,
  getTaskTimes,
  taskIsDone,
  saveTaskTime,
};

export default todosService;                                                                                       