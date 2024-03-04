import React, { ChangeEvent, useCallback, useState } from "react";
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
import { switchIsDone, editTask, removeTask } from "../../redux/taskSlice/CreateTaskSlice";
import { TaskInput } from "../../components/TaskInput/TaskInput";
import { IconButton } from "../../components/IconButton/IconButton";

type Props = {
    task: Task;
};

const TaskDeck: React.FC<Props> = (props) => {
    const { task } = props;
    const dispatch = useDispatch();

    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [inputEdit, setInputEdit] = useState<string>(task.description);

    const handleEdit = useCallback(() => {
        setIsEdit((prev) => !prev);
    }, []);

    const handleDelete = useCallback(() => {
        dispatch(removeTask(task.id));
    }, [dispatch, task.id]);

    const handleSave = useCallback(() => {
        dispatch(editTask({ id: task.id, description: inputEdit }));
        setIsEdit(false);
    }, [dispatch, task.id, inputEdit]);

    const handleCancel = useCallback(() => {
        setIsEdit(false);
    }, []);

    const handleChangeInput = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setInputEdit(e.target.value)
    }, [])

    const handleIsDone = useCallback(() => {
        dispatch(switchIsDone({ id: task.id }));
    }, [dispatch]);



    const renderEditButton = useCallback(() => {
        if (!isEdit) {
            return (
                <>
                    <IconButton>
                        <BiSolidHappyBeaming title="Done" onClick={handleIsDone} />
                    </IconButton>
                    <IconButton onClick={handleEdit}>
                        <BiEditAlt title="Edit" />
                    </IconButton>
                    <IconButton onClick={handleDelete}>
                        <BiSolidTrash title="Trash can" />
                    </IconButton>
                </>
            );
        }
        return (
            <>
                <IconButton onClick={handleSave}>
                    <BiTask title="Accept" />
                </IconButton>
                <IconButton onClick={handleCancel}>
                    <BiTaskX title="Undo" />
                </IconButton>
            </>
        );
    }, [isEdit, handleEdit, handleSave, handleCancel]);

    return (
        <li>
            <div>
                {!isEdit && (
                    <div className={styles.taskContainer}>{task.description}</div>
                )}
                {isEdit && (
                    <TaskInput autoFocus value={inputEdit} onChange={handleChangeInput} />
                )}
            </div>
            <div className={styles.buttons}>{renderEditButton()}</div>
        </li>
    );
};

export default TaskDeck;


