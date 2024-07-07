// @ts-ignore
import React from 'react';
import '@testing-library/jest-dom';
import {render, screen, fireEvent, waitFor} from '@testing-library/react';
import CreateTaskInput from './CreateTaskInput';
import { Context } from '../../../store/Context/Context';
import toast from 'react-hot-toast';
import { Task } from "../../../types/task";
import { typeList } from "../../../types/context";

jest.mock('react-hot-toast');
jest.mock('uuid', () => ({
    v4: jest.fn(() => 'unique-id')
}));

const mockCreateTask = jest.fn();

const mockContextValue = {
    createTask: mockCreateTask,
    updateStatusTask: jest.fn(),
    getTaskListByFilter: jest.fn(),
    deleteCompletedTask: jest.fn(),
    taskList: [] as Task[],
    typeList: "all" as typeList,
    loading: false,
    setTaskList: jest.fn(),
    setTypeList: jest.fn(),
    setLoading: jest.fn(),
};


const renderComponent = () => {
    return render(
        <Context.Provider value={mockContextValue}>
            <CreateTaskInput />
        </Context.Provider>
    );
};

jest.mock('uuid', () => ({
    v4: jest.fn().mockReturnValue('uuid-mock'),
}));

jest.mock('lodash/debounce', () => jest.fn(fn => fn));

jest.mock('react-toastify', () => ({
    toast: {
        error: jest.fn(),
    },
}));


describe('CreateTaskInput', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('компонент рендерится правильно', () => {
        renderComponent();
        expect(screen.getByPlaceholderText('Опишите свою новую задачу...')).toBeInTheDocument();
        expect(screen.getByText('Добавить')).toBeInTheDocument();
    });

    test('изменение состояния при вводе текста', () => {
        renderComponent();
        const input = screen.getByPlaceholderText('Опишите свою новую задачу...');

        fireEvent.change(input, { target: { value: 'Новая задача' } });
        expect(input).toHaveValue('Новая задача');
    });

    test('правильный вызов функции создания задачи', async () => {
        renderComponent();

        const input = screen.getByPlaceholderText('Опишите свою новую задачу...');
        const button = screen.getByRole('button', { name: /Добавить/i });

        fireEvent.change(input, { target: { value: 'New task description' } });
        fireEvent.click(button);

        await waitFor(() => {
            expect(mockCreateTask).toHaveBeenCalledWith({
                id: 'uuid-mock',
                task_text: 'New task description',
                task_status: 0,
            });
        });
        expect(input).toHaveValue('');

    });

    test('вывод ошибок при некорректном вводе', async () => {
        renderComponent();
        const button = screen.getByText('Добавить');

        fireEvent.click(button);

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('Введите описание задачи!', { duration: 2500 });
        });
    });
});