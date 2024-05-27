import React, { ChangeEvent, useCallback, useState, useEffect } from "react";
import {
    BiSolidTrash,
    BiTask,
    BiTaskX,
    BiEditAlt,
    BiCheck,
    BiPlay,
    BiPause,
    BiReset,
    BiTimer
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
    const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
    const [isTimerVisible, setIsTimerVisible] = useState<boolean>(false);
    const [time, setTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [timerStarted, setTimerStarted] = useState<boolean>(false);

    const handleEdit = useCallback(() => {
        setIsEdit((prev) => !prev);
    }, []);

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
        await mutationDelete.mutate(taskId);
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
            setIsTimerRunning(true);
            setIsTimerVisible(true);
            setTimerStarted(true);
        },
        []
    );

    const mutationSaveTime = useMutation({
        mutationFn: async ({ taskId, time }: { taskId: string, time: number }) => {
            const result = await todosService.saveTaskTime({ taskId, time });
            return result;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["todos"] });
        },
    });

    const saveTime = (taskId: string, time: number) => {
        mutationSaveTime.mutate({ taskId, time });
    };

    const handleStop = async (event: React.MouseEvent<HTMLButtonElement>) => {
        setIsTimerRunning(false);
        setIsTimerVisible(false);
        saveTime(taskId, time); // Сохранение времени перед завершением
        await mutationAsDone.mutate(taskId);
    };

    const handleReset = () => {
        setIsTimerRunning(false);
        setIsTimerVisible(false);
        saveTime(taskId, time); // Сохранение времени перед сбросом
        setTime(0);
    };

    const handlePlayPause = () => {
        setIsRunning(prevIsRunning => !prevIsRunning);
    };

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isRunning) {
            interval = setInterval(() => {
                setTime(prevTime => prevTime + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isRunning]);

    const toggleTimerVisibility = () => {
        if (timerStarted) {
            setIsTimerVisible(!isTimerVisible);
        }
    };

    const renderButtons = () => {
        if (isTimerVisible) {
            return (
                <>
                    <IconButton onClick={handlePlayPause}>
                        {isRunning ? <BiPause title="Pause" /> : <BiPlay title="Play" />}
                    </IconButton>
                    <IconButton onClick={handleStop}>
                        <BiCheck title="Stop and Mark as Done" />
                    </IconButton>
                    <IconButton onClick={handleReset}>
                        <BiReset title="Reset" />
                    </IconButton>
                </>
            );
        }

        if (isEdit) {
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
        }

        return (
            <>
                <IconButton onClick={handleIsDone}>
                    <BiTimer title="Start" />
                </IconButton>
                <IconButton onClick={handleEdit}>
                    <BiEditAlt title="Edit" />
                </IconButton>
                <IconButton onClick={onDeleteTask}>
                    <BiSolidTrash title="Trash can" />
                </IconButton>
            </>
        );
    };

    return (
        <div className={styles.taskItem}>
            <li className={styles.taskContainer} onClick={toggleTimerVisibility}>
                <div className={styles.taskContent}>
                    {!isEdit && !isTimerVisible && task.description}
                    {isEdit && (
                        <TaskInput autoFocus value={inputEdit} onChange={handleChangeInput} />
                    )}
                    {isTimerVisible && (
                        <div className={styles.timerContainer}>
                            <p className={styles.timerDisplay}>{new Date(time * 1000).toISOString().substr(11, 8)}</p>
                        </div>
                    )}
                </div>
            </li>
            <div className={styles.buttons}>{renderButtons()}</div>
        </div>
    );
};

export default TaskDeck;
