import "./App.css";
import CreateTask from "./modules/CreateTask/CraeteTask";
import TaskDeck from "./modules/TaskDeck/TaskDeck";
import styles from "./modules/TaskDeck/TaskDeck.module.css";
import { useSelector } from "./redux/store";
// import { useSelector } from "react-redux";
// import { RootState } from "./redux/store";

// const initialList: Task[] = [
//   {
//     id: 1,
//     discription: "string",
//     isDone: true,
//   },
//   {
//     id: 2,
//     discription: "second",
//     isDone: true,
//   },
//   {
//     id: 3,
//     discription: "third",
//     isDone: true,
//   },
// ];

function App() {
  const { allIds, byId } = useSelector((state) => state.todoTasks.tasks);

  console.log("byId", byId);

  return (
    <div>
      <CreateTask />
      <ul className={styles.tracker}>
        {allIds.map((id) => (
          <TaskDeck key={id} task={byId[id]} />
        ))}
      </ul>
    </div>
  );
}

export default App;
