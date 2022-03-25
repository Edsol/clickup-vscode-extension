import * as vscode from 'vscode';
import * as path from 'path';
import { TaskItem } from './items/task_item';
import { ApiWrapper } from '../api_wrapper';

export class TasksDataProvider implements vscode.TreeDataProvider<TaskItem | vscode.TreeItem> {
    apiWrapper: ApiWrapper;

    constructor(apiWrapper: ApiWrapper) {
        this.apiWrapper = apiWrapper;
    }

    getTreeItem(element: TaskItem): vscode.TreeItem {
        return element;
    }

    async getChildren(element?: TaskItem): Promise<(TaskItem | vscode.TreeItem)[]> {
        if (element) {
            console.log(element);
            // return Promise.resolve(element);
            return Promise.resolve([]);
        } else {
            var tasks = await this.apiWrapper.getAllTasks();
            var taskList = await this.extractDescription(tasks);
            console.log(taskList);
            return Promise.resolve(taskList);
        }
    }

    async extractDescription(tasks: any) {
        const taskList = Object.keys(tasks).map(taskId => {
            var task = tasks[taskId];
            return new TaskItem(task.id, task.name, vscode.TreeItemCollapsibleState.None);
        });
        return taskList;
    }
}