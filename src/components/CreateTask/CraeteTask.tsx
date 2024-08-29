import React, { ChangeEvent, useCallback, useEffect, useState } from "react";
import styles from "./CreateTask.module.css";
import { BiSolidPlusCircle } from "react-icons/bi";
import { useDispatch } from "react-redux";
import { setFilterValueAC } from "../../redux/taskSlice/CreateTaskSlice";
import { IconButton } from "../../components/IconButton/IconButton";
import { Filter } from "../../models/InitialTask";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import todosService from "../../services/todos.service";
import ChangeTheme from "../../components/ChangeTheme/ChangeTheme";

const CreateTask: React.FC = () => {

    const dispatch = useDispatch();

    const [taskDescription, setTaskDescription] = useState<string>("");
    const [filterValue, setFilterValue] = useState<Filter>("all");

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async (task: { userId: number; description: string }) => {
            const result = await todosService.createTask(task.userId, task.description)
            return result;
        },
        onSuccess: () => {
            alert('Task was added');
            queryClient.invalidateQueries({ queryKey: ['todos'] });
        }
    });

    const handleAddTask = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
        const userId = 1; // Убедитесь, что userId передается правильно
        const newTask = { userId, description: taskDescription };
        mutation.mutate(newTask);
        setTaskDescription("");
    }, [mutation, taskDescription]);

    const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setTaskDescription(e.target.value);
    }, []);

    const setFilter = useCallback((event: ChangeEvent<HTMLSelectElement>) => {
        setFilterValue(event.target.value as Filter);
    }, []);

    useEffect(() => {
        dispatch(setFilterValueAC(filterValue));
    }, [filterValue, dispatch]);

    return (
        <div className={styles.tasker}>
            <div className={styles.ChangeThemeContainer}>
                <ChangeTheme />
            </div>
            <h2>TO DO LIST</h2>
            <div className={styles.addtsk}>
                <input
                    type="text"
                    placeholder="Enter your task"
                    value={taskDescription}
                    onChange={handleInputChange}
                    autoFocus
                />
                <IconButton onClick={handleAddTask}>
                    <BiSolidPlusCircle title="Add task" />
                </IconButton>
                <select onChange={setFilter} value={filterValue}>
                    <option value="all">All</option>
                    <option value="done">Done</option>
                    <option value="undone">Undone</option>
                </select>
            </div>
        </div>
    );
};

export default CreateTask;
