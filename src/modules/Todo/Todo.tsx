import React, { useMemo } from 'react';
import { useTodos } from '../../hooks/useTodos';
import CreateTask from '../../components/CreateTask/CraeteTask';
import styles from '../../components/CreateTask/CreateTask.module.css';
import { Task } from '../../models/Task';
import TaskDeck from '../../components/TaskDeck/TaskDeck';
import { RootState, useSelector } from '../../redux/store';

const Todo: React.FC = () => {
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
        <>
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
        </>
    );
};

export default Todo;
