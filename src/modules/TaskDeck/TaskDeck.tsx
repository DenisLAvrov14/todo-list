import React, { useCallback, useState } from "react";
import {
    BiSolidHappyBeaming,
    BiSolidTrash,
    BiTask,
    BiTaskX,
    BiEditAlt,
} from "react-icons/bi";
import styles from "../../components/TaskDeck.module.css";
// import stylesIcon from "../../components/IconButtons.module.css"
// import stylesTaskInput from "../../components/TaskInput.module.css"
import { Task } from "../../models/Task";
import { useDispatch } from "react-redux";
import { editTask, removeTask } from "../../redux/taskSlice/CreateTaskSlice";
import { TaskInput } from "../../components/TaskInput/TaskInput";
import { IconButton } from "../../components/IconButton/IconButton";

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
                    <IconButton>
                        <BiSolidHappyBeaming title="Done" />
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
            <div >
                {!isEdit && <div className={styles.taskContainer}>{task.description}</div>}
                {isEdit && (
                    <TaskInput defaultValue={task.description} onBlur={handleEdit} />
                )}
            </div>
            <div className={styles.buttons}>{renderEditButton()}</div>
        </li>
    );
};

export default TaskDeck;
