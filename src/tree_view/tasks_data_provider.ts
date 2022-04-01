import * as vscode from 'vscode';
import { TaskItem } from './items/task_item';
import { ApiWrapper } from '../api_wrapper';

export class TasksDataProvider implements vscode.TreeDataProvider<TaskItem | vscode.TreeItem> {
    // apiWrapper: ApiWrapper;
    tasks: any;

    constructor(tasks: any) {
        // this.apiWrapper = apiWrapper;
        this.tasks = tasks;
    }

    getTreeItem(element: TaskItem): vscode.TreeItem {
        return element;
    }

    async getChildren(element?: TaskItem): Promise<(TaskItem | vscode.TreeItem)[]> {
        if (element) {
            return Promise.resolve([]);
        } else {

            // var tasks = await this.apiWrapper.getAllTasks();
            var taskList = await this.extractDescription(this.tasks);
            console.log(taskList);
            return Promise.resolve(taskList);
        }
    }

    async extractDescription(tasks: any) {
        const taskList = Object.keys(tasks).map(taskId => {
            var task = tasks[taskId];
            return new TaskItem(task.id, task.name, vscode.TreeItemCollapsibleState.Collapsed);
        });
        return taskList;
    }
}