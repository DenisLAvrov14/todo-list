import "./App.css";
import CreateTask from "./modules/CreateTask/CraeteTask";
import TaskDeck from "./modules/TaskDeck/TaskDeck";
import styles from "./modules/CreateTask/CreateTask.module.css";
import { useSelector } from "./redux/store";
import { useMemo } from "react";
import todosService from "./services/todos.service";
import { useQuery } from "@tanstack/react-query";

function App() {
  const { allIds, byId } = useSelector((state) => state.todoTasks.tasks);
  const filter = useSelector((state) => state.todoTasks.filter);

  const taskList = useMemo(() => allIds.map((id) => byId[id]), [allIds, byId]);

  // сделать что бы фильтрация работала
  const { isLoading, data: queryData } = useQuery({
    queryKey: ["todos"],
    queryFn: () => todosService.getAll(),
    select: ({ data }) => data,
  });

  const filteredData = useMemo(() => {
    if (queryData) {
      switch (filter) {
        case "all":
          return queryData;

        case "done":
          return queryData.filter(({ isDone }) => isDone);

        case "undone":
          return queryData.filter(({ isDone }) => !isDone);

        default:
          return [];
      }
    }

    return [];
  }, [filter, queryData]);

  return (
    <div>
      <CreateTask />
      <ul className={styles.tracker}>
        {isLoading ? (
          <div>Loading...</div>
        ) : filteredData?.length ? (
          filteredData.map((task) => <TaskDeck key={task.id} task={task} />)
        ) : (
          <h1>Data not found</h1>
        )}
      </ul>
    </div>
  );
}

export default App;
