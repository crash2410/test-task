import {Task} from "./task.ts";
import {Dispatch, SetStateAction} from "react";

export type typeList = "all" | "completed" | "noCompleted";

export interface ContextProps {
    taskList: Task[]
    typeList: typeList,
    loading: boolean,
    setTaskList: Dispatch<SetStateAction<Task[]>>;
    setTypeList: Dispatch<SetStateAction<typeList>>;
    createTask: (taskData: Task) => Promise<void>;
    updateStatusTask: (taskData: Task) => Promise<void>;
    getTaskListByFilter: (filterName: typeList) => Promise<void>;
    deleteCompletedTask: (taskList: Task[]) => Promise<void>;
}