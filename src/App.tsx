import "./App.css";
import CreateTask from "./modules/CreateTask/CraeteTask";
import TaskDeck from "./modules/TaskDeck/TaskDeck"
import styles from "./modules/CreateTask/CreateTask.module.css";
import { useSelector } from "./redux/store";
import { useMemo } from "react";

function App() {
  const { allIds, byId } = useSelector((state) => state.todoTasks.tasks);
  const filter = useSelector((state) => state.todoTasks.filter);

  const taskList = useMemo(() => allIds.map((id) => byId[id]), [allIds, byId]);

  const data = useMemo(() => {
    switch (filter) {
      case "all":
        return taskList;

      case "done":
        return taskList.filter(({ isDone }) => isDone);

      case "undone":
        return taskList.filter(({ isDone }) => !isDone);
    }

  }, [taskList, filter]);

  console.log("byId", byId);

  return (
    <div>
      <CreateTask />
      <ul className={styles.tracker}>
        {data.map((task) => (
          <TaskDeck key={task.id} task={task} />
        ))}
      </ul>
    </div>
  );
}

export default App;
