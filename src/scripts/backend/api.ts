import axios, {AxiosResponse} from "axios";
import {MOCKAPI} from "../../constants/api.ts";
import {Task} from "../../types/task.ts";

class ApiService {

    async getAllTask(): Promise<Task[]> {
        try {
            const response: AxiosResponse<Task[]> = await axios.get(`${MOCKAPI}taskList`);
            return response.data;
        } catch (error){
            console.error(error);
            return [];
        }
    }

    async createTask(taskData : Task) {
        try {
            await axios.post(`${MOCKAPI}taskList`, taskData)
        } catch (error){
            console.error(error);
            throw error;
        }
    }

    async updateTask(taskData : Task){
        try {
            await axios.put(`${MOCKAPI}taskList/${taskData?.id}`, taskData)
        } catch (error){
            console.error(error);
            throw error;
        }
    }

    async getTaskByStatus(taskStatus : number): Promise<Task[]> {
        try {
            const response: AxiosResponse<Task[]> = await axios.get(`${MOCKAPI}taskList/?task_status=${taskStatus}`);
            return response.data;
        } catch (error){
            console.error(error);
            return [];
        }
    }

    async deleteCompletedTask(taskList: Task[]){
        try {
            for (const task of taskList) {
                await axios.delete(`${MOCKAPI}taskList/${task?.id}`);
            }
        } catch (error){
            console.error(error)
        }
    }

}

export default new ApiService();

