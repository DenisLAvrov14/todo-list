import React, { ChangeEvent, useCallback, useState } from "react";
import {
    BiSolidTrash,
    BiTask,
    BiTaskX,
    BiEditAlt,
    BiCheck,
} from "react-icons/bi";
import styles from "./TaskDeck.module.css";
import { Task } from "../../models/Task";
import { useDispatch } from "react-redux";
import { editTask } from "../../redux/taskSlice/CreateTaskSlice";
import { TaskInput } from "../../components/TaskInput/TaskInput";
import { IconButton } from "../../components/IconButton/IconButton";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import todosService from "../../services/todos.service";

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

    // const handleDelete = useCallback(() => {
    //     dispatch(removeTask(task.id));
    // }, [dispatch, task.id]);

    const taskId = task.id;
    const queryClient = useQueryClient();

    const mutationDelete = useMutation({
        mutationFn: async (taskId: string) => {
            const result = await todosService.deleteTask(taskId);
            return result;
        },
        onSuccess: () => {
            alert("Task was deleted");
            queryClient.invalidateQueries({ queryKey: ["todos"] });
        },
    });

    const onDeleteTask = useCallback(async () => {
        const deleteTask = await mutationDelete.mutate(taskId);
    }, [mutationDelete, taskId]);

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

    const mutationAsDone = useMutation({
        mutationFn: async (taskId: string) => {
            const result = await todosService.taskIsDone(taskId);
            return result;
        },
        onSuccess: () => {
            alert("Task marked as done");
            queryClient.invalidateQueries({ queryKey: ["todos"] });
        },
    });

    const handleIsDone = useCallback(
        async (event: React.MouseEvent<HTMLButtonElement>) => {
            const markAsDone = await mutationAsDone.mutate(taskId);
        },
        [mutationAsDone, taskId]
    );

    // const handleIsDone = useCallback(() => {
    //     dispatch(
    //         editTask({
    //             ...task,
    //             isDone: !task.isDone,
    //         })
    //     );
    // }, [dispatch]);

    const renderEditButton = useCallback(() => {
        if (!isEdit) {
            return (
                <>
                    <IconButton onClick={handleIsDone}>
                        <BiCheck title="Done" />
                    </IconButton>
                    <IconButton onClick={handleEdit}>
                        <BiEditAlt title="Edit" />
                    </IconButton>
                    <IconButton onClick={onDeleteTask}>
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
