// @ts-ignore
import React from 'react';
import {createContext, ReactElement, useEffect, useState} from 'react';
import ApiService from '../../scripts/backend/api.ts'
import {Task} from "../../types/task.ts";
import toast from "react-hot-toast";
import {ContextProps, typeList} from "../../types/context.ts";


export const Context = createContext<ContextProps>({
    taskList: [],
    typeList: "all",
    loading : false,
    setTaskList: () => {
    },
    setTypeList: () => {
    },
    createTask: async () => {
    },
    updateStatusTask: async () => {
    },
    getTaskListByFilter: async () => {
    },
    deleteCompletedTask: async () => {
    },
});

interface Props {
    children: ReactElement
}

const ContextProvider = ({children}: Props) => {
    const [taskList, setTaskList] = useState<Task[]>([]);
    const [typeList, setTypeList] = useState<typeList>("all");
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        getTasks();
    }, [])

    const getTasks = async () => {
        try {
            setLoading(true);
            setTaskList(await ApiService.getAllTask());
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.error(error);
        }
    }

    const createTask = async (taskData: Task) => {
        try {
            await ApiService.createTask(taskData);
            toast.success('Новая задача успешно добавлена в список!', {
                duration: 2500,
            });
            await getTaskListByFilter(typeList);
        } catch (error) {
            toast.error('Ошибка при создании новой задачи!', {
                duration: 2500,
            });
            console.error(error)
        }
    }

    const getTaskListByFilter = async (filterName: typeList) => {
        try {
            switch (filterName) {
                case "all":
                    setTaskList(await ApiService.getAllTask());
                    setTypeList("all");
                    break;
                case "completed":
                    setTaskList(await ApiService.getTaskByStatus(1));
                    setTypeList("completed");
                    break
                case "noCompleted":
                    setTaskList(await ApiService.getTaskByStatus(0));
                    setTypeList("noCompleted");
                    break
                default:
                    break
            }
        } catch (error) {
            toast.error('Ошибка при получении списка задач!', {
                duration: 2500,
            });
            console.log(error)
        }
    }

    const updateStatusTask = async (taskData: Task) => {
        try {
            await ApiService.updateTask(taskData);
            await getTaskListByFilter(typeList);
        } catch (error) {
            console.error(error)
        }
    }

    const deleteCompletedTask = async (taskList: Task[]) => {
        try {
            await ApiService.deleteCompletedTask(taskList);
            await getTaskListByFilter(typeList);
        } catch (error) {
            console.error(error)
        }
    }


    return (
        <Context.Provider value={{
            taskList,
            typeList,
            loading,
            setTaskList,
            setTypeList,
            createTask,
            updateStatusTask,
            getTaskListByFilter,
            deleteCompletedTask
        }}>
            {children}
        </Context.Provider>
    );
};

export default ContextProvider;