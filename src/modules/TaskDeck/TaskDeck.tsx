import React, { ChangeEvent, useCallback, useEffect, useState } from "react";
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
import todosService, { saveTaskTime, taskIsDone } from "../../services/todos.service";

type Props = {
    task: Task;
};

const TaskDeck: React.FC<Props> = (props) => {
    const { task } = props;
    const dispatch = useDispatch();
    const userId = 1; 

    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [inputEdit, setInputEdit] = useState<string>(task.description);
    const [isTimerVisible, setIsTimerVisible] = useState<boolean>(false);
    const [time, setTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [timerStarted, setTimerStarted] = useState<boolean>(false);
    const [cursorPointer, setCursorPointer] = useState<boolean>(false); // новое состояние для управления курсором
    const [startTime, setStartTime] = useState<Date | null>(null); // добавляем состояние для startTime

    const handleEdit = useCallback(() => {
        setIsEdit((prev) => !prev);
    }, []);

    const taskId = parseInt(task.id, 10); // преобразуем taskId в number
    const queryClient = useQueryClient();

    const mutationDelete = useMutation({
        mutationFn: async (taskId: number) => {
            const result = await todosService.deleteTodo(taskId);
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
    }, [dispatch, task, inputEdit]);

    const handleCancel = useCallback(() => {
        setIsEdit(false);
    }, []);

    const handleChangeInput = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setInputEdit(e.target.value);
    }, []);

    const handleIsDone = useCallback(
        async (event: React.MouseEvent<HTMLButtonElement>) => {
            setIsTimerVisible(true);
            setTimerStarted(true);
            setCursorPointer(true); // устанавливаем курсор на pointer
            setStartTime(new Date()); // Устанавливаем текущее время как startTime
        },
        []
    );

    const mutationSaveTime = useMutation({
        mutationFn: async ({ taskId, startTime, endTime, duration }: { taskId: number, userId: number, startTime: Date, endTime: Date, duration: number }) => {
            const result = await todosService.saveTaskTime(taskId, userId, startTime, endTime, duration);
            return result;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["todos"] });
        },
    });

    const saveTime = (taskId: number, startTime: Date, endTime: Date, duration: number) => {
        const userId = 1; // Используйте актуальный userId здесь
        mutationSaveTime.mutate({ taskId, userId, startTime, endTime, duration });
    };
          
    const handleStopAndMarkAsDone = async (event: React.MouseEvent<HTMLButtonElement>) => {
        setIsTimerVisible(false);
        const endTime = new Date();
    
        if (startTime) {
            const duration = (endTime.getTime() - startTime.getTime()) / 1000; // продолжительность в секундах
            console.log(`Saving task time for Task ID: ${taskId}, Duration: ${duration}s`);
            await saveTaskTime(taskId, userId, startTime, endTime, duration); // Сохранение времени
        }
    
        console.log(`Marking task with ID ${taskId} as done`);
        await taskIsDone(taskId); // Пометить задачу как выполненную
        console.log(`Task with ID ${taskId} should now be marked as done`);
    };
    
      const handleReset = () => {
        setIsTimerVisible(false);
        const endTime = new Date();
        if (startTime) {
          const duration = (endTime.getTime() - startTime.getTime()) / 1000; // продолжительность в секундах
          saveTime(taskId, startTime, endTime, duration); // Сохранение времени перед сбросом
        }
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
                    <IconButton onClick={handleStopAndMarkAsDone}>
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
            <li className={`${styles.taskContainer} ${cursorPointer ? styles.cursorPointer : ''}`} onClick={toggleTimerVisibility}>
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
