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
import { editTask, removeTask } from "../../redux/taskSlice/CreateTaskSlice";
import { TaskInput } from "../../components/TaskInput/TaskInput";
import { IconButton } from "../../components/IconButton/IconButton";
import {
    //   QueryClient,
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";
import { QueryClient } from "react-query";
import useDeleteTask from "../../hooks/useDeleteTask";
import { moks } from "../../moks/moks";

type Props = {
    task: Task;
};

const TaskDeck: React.FC<Props> = (props) => {
    const { task } = props;
    const dispatch = useDispatch();

    const queryClient: QueryClient = useQueryClient();
    console.log("queryClient", queryClient);
    const { mutate: deleteMutate } = useDeleteTask(queryClient);

    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [inputEdit, setInputEdit] = useState<string>(task.description);

    const handleEdit = useCallback(() => {
        setIsEdit((prev) => !prev);
    }, []);

    // const handleDelete = useCallback(() => {
    //     dispatch(removeTask(task.id));
    // }, [dispatch, task.id]);

    // const handleDelete = useCallback(async (id: string) => {
    //     // сделать удаление таска
    //     try {
    //         if (deleteTask !== undefined) {
    //             await deleteTask(id);
    //         } else {
    //             console.error('deleteTask is undefined');
    //         }
    //     } catch (error) {
    //         console.error('An error occurred while deleting the task:', error);
    //     }
    //     invalidateQueries(["todos"]);
    // }, [invalidateQueries]);

    const handleSave = useCallback(() => {
        dispatch(
            editTask({
                ...task,
                description: inputEdit,
            })
        );
        setIsEdit(false);
    }, [dispatch, task.id, inputEdit]);

    const handleCancel = useCallback(() => {
        setIsEdit(false);
    }, []);

    const handleChangeInput = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setInputEdit(e.target.value);
    }, []);

    const handleIsDone = useCallback(() => {
        dispatch(
            editTask({
                ...task,
                isDone: !task.isDone,
            })
        );
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
                    {/* <IconButton onClick={() => deleteMutate(task.id)}>
                        <BiSolidTrash title="Trash can" />
                    </IconButton> */}
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
