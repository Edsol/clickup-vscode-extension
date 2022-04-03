import * as vscode from 'vscode';
import { TaskItem } from './items/task_item';

export class TasksDataProvider implements vscode.TreeDataProvider<TaskItem | vscode.TreeItem> {
    tasks: any;

    constructor(tasks: any) {
        this.tasks = tasks;
    }

    getTreeItem(element: TaskItem): vscode.TreeItem {
        return element;
    }

    async getChildren(element?: TaskItem): Promise<(TaskItem | vscode.TreeItem)[]> {
        console.log('getChildren', element);
        if (element) {
            return Promise.resolve([]);
        } else {
            var taskList = await this.extractDescription(this.tasks);
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