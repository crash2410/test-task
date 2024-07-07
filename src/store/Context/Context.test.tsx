// @ts-ignore
import React from 'react';
import '@testing-library/jest-dom'
import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import ContextProvider, { Context } from './Context.tsx'; // Путь к вашему компоненту
import ApiService from '../../scripts/backend/api.ts'; // Путь к вашему API сервису
import { Task } from "../../types/task.ts";
import toast from "react-hot-toast"; // Путь к вашему типу Task

// Мокаем ApiService
jest.mock('../../scripts/backend/api.ts', () => ({
    getAllTask: jest.fn(),
    createTask: jest.fn(),
    getTaskByStatus: jest.fn(),
    updateTask: jest.fn(),
    deleteCompletedTask: jest.fn(),
}));

jest.mock('react-hot-toast', () => ({
    success: jest.fn()
}));

describe('ContextProvider', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('getTasks - проверяем корректность получения задач', async () => {
        const mockTasks: Task[] = [
            { id: "1", task_text: 'Task 1', task_status: 0 },
            { id: "2", task_text: 'Task 2', task_status: 1 }
        ];

        // Мокаем возвращаемое значение getAllTask
        (ApiService.getAllTask as jest.Mock).mockResolvedValue(mockTasks);

        render(
            <ContextProvider>
                <Context.Consumer>
                    {({ taskList, loading }) => (
                        <div>
                            {loading ? <span>Loading...</span> : <span>Loaded</span>}
                            <ul>
                                {taskList.map(task => (
                                    <li key={task.id}>{task.task_text}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </Context.Consumer>
            </ContextProvider>
        );

        // Проверяем, что изначально отображается состояние загрузки
        expect(screen.getByText('Loading...')).toBeInTheDocument();

        // Ждем, пока загрузка завершится и задачи будут отображены
        await waitFor(() => expect(screen.getByText('Loaded')).toBeInTheDocument());

        // Проверяем, что задачи отображаются корректно
        mockTasks.forEach(task => {
            expect(screen.getByText(task.task_text)).toBeInTheDocument();
        });
    });

    test('should create a task and show success toast', async () => {
        const mockTask: Task = { id: "1", task_text: 'Task 1', task_status: 0 };

        // Мокаем возвращаемое значение createTask
        (ApiService.createTask as jest.Mock).mockResolvedValue(mockTask);

        render(
            <ContextProvider>
                <Context.Consumer>
                    {({ createTask }) => (
                        <button onClick={() => createTask(mockTask)}>Create Task</button>
                    )}
                </Context.Consumer>
            </ContextProvider>
        );

        // Кликаем на кнопку для создания задачи
        fireEvent.click(screen.getByText('Create Task'));

        // Ждем, пока завершится асинхронная операция
        await waitFor(() => expect(toast.success).toHaveBeenCalledWith('Новая задача успешно добавлена в список!', { duration: 2500 }));

        // Проверяем, что createTask был вызван с правильными аргументами
        expect(ApiService.createTask).toHaveBeenCalledWith(mockTask);
    });

    test('getTaskListByFilter - проверяем корректность фильтрации задач', async () => {
        const mockAllTasks: Task[] = [
            { id: "1", task_text: 'Task 1', task_status: 0 },
            { id: "2", task_text: 'Task 2', task_status: 1 }
        ];
        const mockCompletedTasks: Task[] = [
            { id: "2", task_text: 'Task 2', task_status: 1 }
        ];
        const mockNoCompletedTasks: Task[] = [
            { id: "1", task_text: 'Task 1', task_status: 0 }
        ];

        // Мокаем возвращаемые значения для различных фильтров
        (ApiService.getAllTask as jest.Mock).mockResolvedValue(mockAllTasks);
        (ApiService.getTaskByStatus as jest.Mock).mockImplementation((status: number) => {
            if (status === 1) return mockCompletedTasks;
            if (status === 0) return mockNoCompletedTasks;
            return [];
        });

        render(
            <ContextProvider>
                <Context.Consumer>
                    {({ taskList, getTaskListByFilter }) => (
                        <div>
                            <button onClick={() => getTaskListByFilter("all")}>Filter All</button>
                            <button onClick={() => getTaskListByFilter("completed")}>Filter Completed</button>
                            <button onClick={() => getTaskListByFilter("noCompleted")}>Filter No Completed</button>
                            <ul>
                                {taskList.map(task => (
                                    <li key={task.id}>{task.task_text}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </Context.Consumer>
            </ContextProvider>
        );

        // Проверяем фильтрацию по всем задачам
        fireEvent.click(screen.getByText('Filter All'));
        await waitFor(() => expect(screen.getByText('Task 1')).toBeInTheDocument());
        await waitFor(() => expect(screen.getByText('Task 2')).toBeInTheDocument());

        // Проверяем фильтрацию по завершенным задачам
        fireEvent.click(screen.getByText('Filter Completed'));
        await waitFor(() => expect(screen.getByText('Task 2')).toBeInTheDocument());
        await waitFor(() => expect(screen.queryByText('Task 1')).toBeNull());

        // Проверяем фильтрацию по незавершенным задачам
        fireEvent.click(screen.getByText('Filter No Completed'));
        await waitFor(() => expect(screen.getByText('Task 1')).toBeInTheDocument());
        await waitFor(() => expect(screen.queryByText('Task 2')).toBeNull());
    });

    test('updateStatusTask - проверяем корректность обновления статуса задачи', async () => {
        const mockTask: Task = { id: "1", task_text: 'Task 1', task_status: 0 };
        const updatedMockTask: Task = { ...mockTask, task_status: 1 };

        // Мокаем возвращаемое значение updateTask
        (ApiService.updateTask as jest.Mock).mockResolvedValue(updatedMockTask);

        // Мокаем возвращаемое значение getTaskByStatus для завершенных задач
        (ApiService.getTaskByStatus as jest.Mock).mockResolvedValue([updatedMockTask]);

        render(
            <ContextProvider>
                <Context.Consumer>
                    {({ updateStatusTask, taskList }) => (
                        <div>
                            <button onClick={() => updateStatusTask(mockTask)}>Update Task</button>
                            <ul>
                                {taskList.map(task => (
                                    <li key={task.id}>{task.task_text} - {task.task_status === 1 ? 'Completed' : 'Not Completed'}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </Context.Consumer>
            </ContextProvider>
        );

        // Кликаем на кнопку для обновления статуса задачи
        fireEvent.click(screen.getByText('Update Task'));

        // Ждем, пока завершится асинхронная операция
        await waitFor(() => expect(ApiService.updateTask).toHaveBeenCalledWith(mockTask));

    });

    test('deleteCompletedTask - проверяем корректность удаления завершенных задач', async () => {
        const mockTasks: Task[] = [
            { id: "1", task_text: 'Task 1', task_status: 0 },
            { id: "2", task_text: 'Task 2', task_status: 1 }
        ];
        const mockNoCompletedTasks: Task[] = [
            { id: "1", task_text: 'Task 1', task_status: 0 }
        ];

        // Мокаем возвращаемое значение deleteCompletedTask
        (ApiService.deleteCompletedTask as jest.Mock).mockResolvedValue(mockNoCompletedTasks);

        // Мокаем возвращаемое значение getTaskByStatus для незавершенных задач
        (ApiService.getTaskByStatus as jest.Mock).mockResolvedValue(mockNoCompletedTasks);

        render(
            <ContextProvider>
                <Context.Consumer>
                    {({ deleteCompletedTask, taskList }) => (
                        <div>
                            <button onClick={() => deleteCompletedTask(mockTasks)}>Delete Completed Tasks</button>
                            <ul>
                                {taskList.map(task => (
                                    <li key={task.id}>{task.task_text}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </Context.Consumer>
            </ContextProvider>
        );

        // Кликаем на кнопку для удаления завершенных задач
        fireEvent.click(screen.getByText('Delete Completed Tasks'));

        // Ждем, пока завершится асинхронная операция
        await waitFor(() => expect(ApiService.deleteCompletedTask).toHaveBeenCalledWith(mockTasks));
    });


});