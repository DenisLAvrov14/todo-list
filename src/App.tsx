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
        console.log("Filter applied:", filter);
        console.log("Data before filtering:", queryData);
  
        switch (filter) {
            case "all":
                return queryData;
            case "done":
                const doneTasks = queryData.filter(({ is_done }: { is_done: number }) => Boolean(is_done));
                console.log("Done tasks:", doneTasks);
                return doneTasks;
            case "undone":
                const undoneTasks = queryData.filter(({ is_done }: { is_done: number }) => !Boolean(is_done));
                console.log("Undone tasks:", undoneTasks);
                return undoneTasks;
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
                    filteredData.map((task: Task) => {
                        console.log("Rendering task:", task);
                        return <TaskDeck key={task.id} task={task} />;
                    })
                ) : (
                    <h1>Data not found</h1>
                )}
            </ul>
        </div>
    </div>
  );
}

export default App;
