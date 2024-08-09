import React, { useMemo } from "react";
import "./App.css";
import CreateTask from "./modules/CreateTask/CraeteTask";
import TaskDeck from "./modules/TaskDeck/TaskDeck";
import styles from "./modules/CreateTask/CreateTask.module.css";
import { useSelector } from "./redux/store";
import { RootState } from "./redux/store"; // убедитесь, что у вас есть RootState
import { useTodos } from "./hooks/useTodos";
import Navbar from "./components/Navbar/Navbar";
import { Task } from "./models/Task"; // убедитесь, что у вас есть Task модель

function App() {
  const filter = useSelector((state: RootState) => state.todoTasks.filter);

  const { isLoading, data: queryData } = useTodos();

  const filteredData = useMemo(() => {
    if (queryData) {
      switch (filter) {
        case "all":
          return queryData;
        case "done":
          return queryData.filter(({ isDone }: { isDone: boolean }) => isDone);
        case "undone":
          return queryData.filter(({ isDone }: { isDone: boolean }) => !isDone);
        default:
          return [];
      }
    }
    return [];
  }, [filter, queryData]);

  return (
    <div className="app">
      <Navbar />
      <div className="content">
        <CreateTask />
        <ul className={styles.tracker}>
          {isLoading ? (
            <div>Loading...</div>
          ) : filteredData?.length ? (
            filteredData.map((task: Task) => <TaskDeck key={task.id} task={task} />)
          ) : (
            <h1>Data not found</h1>
          )}
        </ul>
      </div>
    </div>
  );
}

export default App;
