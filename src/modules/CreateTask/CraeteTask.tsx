import React, {
    ChangeEvent,
    useCallback,
    useEffect,
    useState,
} from "react";
import styles from "../../components/CreateTask.module.css";
// import stylesIcon from "../../components/IconButtons.module.css"
import { BiSolidPlusCircle } from "react-icons/bi";
import { useDispatch } from "react-redux";
import { addTask, setFilterValueAC } from "../../redux/taskSlice/CreateTaskSlice";
import { IconButton } from "../../components/IconButton/IconButton";

const CreateTask: React.FC = () => {
    const dispatch = useDispatch();

    const [taskDescription, setTaskDescription] = useState<string>("");
    const [filterValue, setFilterValue] = useState<string>("");

    const handleClick = useCallback(() => {
        dispatch(addTask({ description: taskDescription }));
        setTaskDescription("");
    }, [dispatch, taskDescription]);

    const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setTaskDescription(e.target.value);
    }, []);

    const setFilter = useCallback((event: ChangeEvent<HTMLSelectElement>) => {
        setFilterValue(event.target.value);
    }, []);

    useEffect(() => {
        // задиспатчить экшн который будет сетать значние фильтра в стор
        dispatch(setFilterValueAC(filterValue))
    }, [filterValue])

    return (
        <div className={styles.tasker}>
            <h2>TO DO LIST</h2>
            <div className={styles.addtsk}>
                <input
                    type="text"
                    placeholder="Enter your task"
                    value={taskDescription}
                    onChange={handleInputChange}
                    autoFocus
                />
                <IconButton onClick={handleClick}>
                    <BiSolidPlusCircle title="Add task" />
                </IconButton>
                <select onChange={setFilter}>
                    <option value="all">All</option>
                    <option value="done">Done</option>
                    <option value="undone">Undone</option>
                </select>
            </div>
        </div>
    );
};

export default CreateTask;
