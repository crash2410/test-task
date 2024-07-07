// @ts-ignore
import React from 'react';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import {styled} from "@mui/material/styles";
import {useContext} from "react";
import {Context} from "../../../store/Context/Context.tsx";
// @ts-ignore
import style from './TaskListBar.module.css';
import {Task} from "../../../types/task.ts";
import toast from "react-hot-toast";

const TaskListBar = () => {
    const {taskList,typeList, getTaskListByFilter, deleteCompletedTask} = useContext(Context);

    const changeNewTypeList = async (newTypeList: typeof typeList) => {
        if (newTypeList === typeList) {
            return
        }

        try {
            await getTaskListByFilter(newTypeList);
        } catch (error) {
            console.error(error)
        }
    }

    const deleteCompletedTasks = async (taskList : Task[]) => {

        const completedTaskArray = taskList.filter((task) => task?.task_status === 1)

        if (completedTaskArray.length){
            try {
                await deleteCompletedTask(completedTaskArray);
            } catch (error) {
                console.error(error)
            }
        } else {
            toast.error('В списке нет завершенных задач!', {
                duration: 2500,
            });
        }
    }

    return (
       <div className={style.barContainer}>
           <ButtonGroupBar variant="contained" aria-label="Basic button group">
               <StyledButton selected={typeList === 'all'} onClick={() => changeNewTypeList("all")}>Все</StyledButton>
               <StyledButton selected={typeList === 'noCompleted'} onClick={() => changeNewTypeList("noCompleted")}>Активные</StyledButton>
               <StyledButton selected={typeList === 'completed'} onClick={() => changeNewTypeList("completed")}>Завершенные</StyledButton>
               <StyledButton onClick={() => deleteCompletedTasks(taskList)} >Удалить завершенные</StyledButton>
           </ButtonGroupBar>
       </div>
    );
};

export default TaskListBar;


const ButtonGroupBar = styled(ButtonGroup)(() => ({
    width: "100%",
    display: "flex",
    justifyContent: "space-around",
    boxShadow: "none",
    '& .MuiButtonBase-root': {
        border: "none",
        borderRadius: "4px",
    },
}))

const StyledButton = styled(Button)<{ selected?: boolean }>(({ selected }) => ({
    backgroundColor: selected ? 'gray' : '#61909c',
    color: "white",
    '&:hover': {
        backgroundColor: 'gray',
    }
}));