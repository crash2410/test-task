// @ts-ignore
import React from 'react';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import { styled } from '@mui/material/styles';
import {Button} from "@mui/material";
import {ChangeEvent, FormEvent, useCallback, useContext, useState} from "react";
import {Task} from "../../../types/task.ts";
import {Context} from "../../../store/Context/Context.tsx";
import _debounce from "lodash/debounce";
import toast from "react-hot-toast";
import { v4 as uuidv4 } from 'uuid';

const AddTaskButton = styled(Button)(() => ({
    height: "100%",
    color: "white",
    borderRadius: "0px 4px 4px 0px",
    backgroundColor: "#61909c",
    '&:hover': {
        backgroundColor: "gray",
    },
}));

const CreateTaskInput = () => {
    const {createTask} = useContext(Context);
    const [taskText, setTaskText] = useState<String>('');
    const [newTaskData, setNewTaskData] = useState<Task>({id: uuidv4(), task_text: "", task_status: 0});

    const createNewTask = async () => {
        if (!newTaskData.task_text.trim()){
            toast.error('Введите описание задачи!', {
                duration: 2500,
            });
            return
        }

        try {
            await createTask(newTaskData);
            setTaskText("");
            setNewTaskData({id: uuidv4(), task_text: "", task_status: 0});
        } catch (error) {
            console.error(error)
        }

    }
    const debounceFn = useCallback(
        _debounce((inputValue: string) => {
            setNewTaskData((prevState) => ({ ...prevState, task_text: inputValue }));
        }, 200),
        []
    );

    function handleChange (event : ChangeEvent<HTMLInputElement>) {
        setTaskText(event.target.value);
        debounceFn(event.target.value);
    };

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        await createNewTask()
    };

    return (
        <Paper
            component="form"
            sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: "100%", height: 40, padding: 0, mt: 2 }}
            onSubmit={handleSubmit}
        >
            <InputBase
                sx={{ ml: 2, flex: 1 }}
                placeholder="Опишите свою новую задачу..."
                value={taskText}
                onChange={handleChange}
                inputProps={{ 'aria-label': 'опишите свою задачу...' }}
            />
            <AddTaskButton variant="contained" onClick={createNewTask}>Добавить</AddTaskButton>
        </Paper>
    );
};

export default CreateTaskInput;