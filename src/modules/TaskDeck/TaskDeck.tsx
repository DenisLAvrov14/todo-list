import React, { ReactNode, useCallback, useState } from "react";
import {
    BiSolidHappyBeaming,
    BiSolidTrash,
    BiTask,
    BiTaskX,
    BiEditAlt,
} from "react-icons/bi";
import styles from "../../components/TaskDeck.module.css";
import stylesIcon from "../../components/IconButtons.module.css"
import stylesTaskInput from "../../components/TaskInput.module.css"
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
                <>
                    <button className={stylesIcon.IconButtons} ><BiSolidHappyBeaming title="Done" /></button>
                    <button className={stylesIcon.IconButtons} onClick={handleEdit}><BiEditAlt title="Edit" /></button>
                    <button className={stylesIcon.IconButtons} onClick={handleDelete}><BiSolidTrash title="Trash can" /></button>
                </>
            );
        }
        return (
            <>
                <button className={stylesIcon.IconButtons} onClick={handleSave}><BiTask title="Accept" /></button>
                <button className={stylesIcon.IconButtons} onClick={handleCancel}><BiTaskX title="Undo" /></button>
            </>
        );
    }, [isEdit, handleEdit, handleSave, handleCancel]);

    return (
        <li>
            <div className={styles.taskContainer}>
                {!isEdit && <div className={stylesTaskInput.taskInput}>{task.description}</div>}
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
                {renderEditButton()}
            </div>
        </li>
    );
};

export default TaskDeck;
