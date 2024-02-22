import React, { useCallback, useState } from "react";
import styles from "./CreateTask.module.css";
import { BiSolidPlusCircle } from "react-icons/bi";
import { useDispatch } from "react-redux";
import { addTask } from "../../redux/taskSlice/CreateTaskSlice";

const CreateTask: React.FC = () => {
    const dispatch = useDispatch();

    const [taskDescription, setTaskDescription] = useState<string>("");

    const handleClick = useCallback(() => {
        dispatch(addTask({ description: taskDescription }));
        setTaskDescription("");
    }, [dispatch, taskDescription]);

    const handleInputChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setTaskDescription(e.target.value);
        },
        []
    );

    return (
        <div className={styles.tasker}>
            <h2>TO DO LIST</h2>
            <div className={styles.addtsk}>
                <input
                    type="text"
                    placeholder="Enter your task"
                    value={taskDescription}
                    onChange={handleInputChange}
                />
                <button className={styles.button} onClick={handleClick}>
                    <BiSolidPlusCircle className={styles.icon} />
                </button>
                <select>
                    <option value="all">All</option>
                    <option value="done">Done</option>
                    <option value="undone">Undone</option>
                </select>
            </div>
        </div>
    );
};

export default CreateTask;
