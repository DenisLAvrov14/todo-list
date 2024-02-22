import React, { ReactNode, useCallback, useState } from "react";
import {
    BiSolidHappyBeaming,
    BiSolidTrash,
    BiTask,
    BiTaskX,
    BiEditAlt,
} from "react-icons/bi";
import styles from "./TaskDeck.module.css";
import { Task } from "../../models/Task";
import { useDispatch } from "react-redux";
import { editTask, removeTask } from "../../redux/taskSlice/CreateTaskSlice";

type Props = {
    task: Task;
};

const TaskDeck: React.FC<Props> = (props) => {
    const { task } = props;
    const dispatch = useDispatch();

    const [isEdit, setIsEdit] = useState<boolean>(false);

    const handleEdit = useCallback(() => {
        setIsEdit((prev) => !prev);
    }, []);

    const handleDelete = useCallback(() => {
        dispatch(removeTask(task.id));
    }, [dispatch, task.id]);

    const handleSave = useCallback(() => {
        setIsEdit(false);
    }, []);

    const handleCancel = useCallback(() => {
        setIsEdit(false);
    }, []);

    const renderEditButton = useCallback(() => {
        if (!isEdit) {
            return (
                <button onClick={handleEdit}>
                    <BiEditAlt className={styles.icon} />
                </button>
            );
        }
        return (
            <>
                <button onClick={handleSave}>  <BiTask className={styles.icon} /></button>
                <button onClick={handleCancel}> <BiTaskX className={styles.icon} /></button>
            </>
        );
    }, [isEdit, handleEdit, handleSave, handleCancel]);

    return (
        <li>
            <div className={styles["task-container"]}>
                {!isEdit && <div>{task.description}</div>}
                {isEdit && (
                    <input
                        type="text"
                        defaultValue={task.description}
                        onBlur={handleEdit}
                        autoFocus
                    />
                )}
            </div>
            <div className={styles.buttons}>
                <button onClick={handleDelete}>
                    <BiSolidTrash className={styles.icon} />
                </button>
                {renderEditButton()}
            </div>
        </li>
    );
};

export default TaskDeck;
