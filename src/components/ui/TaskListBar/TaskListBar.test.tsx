// @ts-ignore
import React from 'react';
import '@testing-library/jest-dom';
import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import TaskListBar from './TaskListBar';
import { Context } from '../../../store/Context/Context';
import {Task} from "../../../types/task.ts";
import {typeList} from "../../../types/context.ts";

const mockContextValue = {
    createTask: jest.fn(),
    updateStatusTask: jest.fn(),
    getTaskListByFilter: jest.fn(),
    deleteCompletedTask: jest.fn(),
    taskList: [] as Task[],
    typeList: 'all' as typeList,
    loading: false,
    setTaskList: jest.fn(),
    setTypeList: jest.fn(),
    setLoading: jest.fn(),
};

const mockTaskList: Task[] = [
    { id: "1", task_status: 0, task_text: 'value1' },
    { id: "2", task_status: 1, task_text: 'value2' },
    { id: "3", task_status: 1, task_text: 'value3' },
];

test('отображает четыре кнопки с правильными надписями', () => {
    render(
        <Context.Provider value={mockContextValue}>
            <TaskListBar />
        </Context.Provider>
    );

    const allButton = screen.getByText('Все');
    const activeButton = screen.getByText('Активные');
    const completedButton = screen.getByText('Завершенные');
    const deleteCompletedButton = screen.getByText('Удалить завершенные');

    expect(allButton).toBeInTheDocument();
    expect(activeButton).toBeInTheDocument();
    expect(completedButton).toBeInTheDocument();
    expect(deleteCompletedButton).toBeInTheDocument();
});

test('changeNewTypeList вызывает getTaskListByFilter с правильным аргументом', async () => {
    render(
        <Context.Provider value={{ ...mockContextValue }}>
            <TaskListBar />
        </Context.Provider>
    );

    const activeButton = screen.getByText('Активные');
    fireEvent.click(activeButton);

    await waitFor(() => {
        expect(mockContextValue.getTaskListByFilter).toHaveBeenCalledWith('noCompleted');
    });
});

test('deleteCompletedTasks вызывает deleteCompletedTask с правильным аргументом', async () => {
    render(
        <Context.Provider value={{ ...mockContextValue, taskList: mockTaskList }}>
            <TaskListBar />
        </Context.Provider>
    );

    const deleteCompletedButton = screen.getByText('Удалить завершенные');
    fireEvent.click(deleteCompletedButton);

    await waitFor(() => {
        expect(mockContextValue.deleteCompletedTask).toHaveBeenCalledWith([
            { id: "2", task_status: 1, task_text: 'value2' },
            { id: "3", task_status: 1, task_text: 'value3' },
        ]);
    });
});
