import style from "./TaskList.module.css"
import {useContext} from "react";
import {Context} from "../../../store/Context/Context.tsx";
import {Checkbox, FormControlLabel} from "@mui/material";
import {styled} from "@mui/material/styles";
import {Task} from "../../../types/task.ts";
import {v4 as uuidv4} from 'uuid';
import noTask from "/noTask.gif";

const TaskList = () => {
    const {loading, taskList, updateStatusTask,} = useContext(Context);

    const changeAccessTask = async (task: Task) => {
        try {
            const updateDataTask = {...task, task_status: (task?.task_status === 1) ? 0 : 1};
            await updateStatusTask(updateDataTask);
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className={style.taskList}>
            {loading && <div className={style.loading}>Загрузка списка</div>}
            {taskList.length > 0 && taskList.map((task: Task) => {
                    return <div className={style.task} key={uuidv4()}>
                        <TaskContent
                            task={task}
                            control={
                                <CheckboxTask checked={task?.task_status === 1}
                                              value={task?.task_status === 1}
                                              onChange={() => changeAccessTask(task)}
                                />
                            }
                            label={task?.task_text}/>
                    </div>
            })}
            { taskList.length === 0 &&
                <div className={style.noData}>
                    <img src={noTask} alt="Example GIF" className={style.gif}/>
                    <span>Список задач пуст</span>
                </div>

            }
        </div>
    );
};

export default TaskList;

interface TaskContentProps {
    task: Task
}

const TaskContent = styled(FormControlLabel)(({task}: TaskContentProps) => ({
    height: "50px",
    paddingLeft: "20px",
    width: "100%",
    '& .MuiTypography-root': {paddingLeft: 10},
    ...(task?.task_status === 1 && {
        textDecoration: 'line-through',
    })
}))

const CheckboxTask = styled(Checkbox)(() => ({
    '& .MuiSvgIcon-root': {
        fontSize: 30,
        '& :hover': {
            fill: "red"
        }

    },

}))