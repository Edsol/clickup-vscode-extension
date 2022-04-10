import * as vscode from 'vscode';
import { TaskItem } from './items/task_item';
import { StatusItem } from './items/status_item';
import { TaskDetail } from './items/task_detail';
import * as types from '../types';

export class TasksDataProvider implements vscode.TreeDataProvider<TaskItem | vscode.TreeItem> {
    tasks: any;
    statusList: any = [];
    tasksByStatus: any = [];
    propertyToShow: Array<string> = [];

    constructor(tasks: any, propertyToShow: Array<string>) {
        this.tasks = tasks;
        this.propertyToShow = propertyToShow;
        this.tasksByStatus = this.filterByStatus(tasks);
    }

    getTreeItem(element: TaskItem): vscode.TreeItem {
        return element;
    }

    async getChildren(element?: (StatusItem)): Promise<(vscode.TreeItem)[]> {
        var resolve: any = [];

        if (element === undefined) {
            resolve = Object.values(this.statusList).map((status: any) => {
                return new StatusItem(
                    status.name,
                    status.status.toUpperCase(),
                    vscode.TreeItemCollapsibleState.Collapsed,
                    this.tasksByStatus[status.status]
                );
            });
        }

        if (element instanceof StatusItem) {
            var statusName = element.label.toLowerCase();
            var resolve = this.tasksByStatus[statusName].map((task: any) => {
                return new TaskItem(task, vscode.TreeItemCollapsibleState.Collapsed);
            });
        }

        if (element instanceof TaskItem) {
            Object.entries(element.task).find(([key, value]) => {
                if (this.propertyToShow.includes(key)) {
                    var taskDetail = new TaskDetail(key, `${value}`, vscode.TreeItemCollapsibleState.None);
                    resolve.push(taskDetail);
                }

            });
        }

        return Promise.resolve(resolve);
    }

    filterByStatus(tasks: any) {
        var result: any = {};

        tasks.map(async (task: types.Task) => {
            var status: types.Status = task.status;
            await this.addStatus(status);
            var statusName = status.status.toLowerCase();
            if (result[statusName] === undefined) {
                result[statusName] = [];
            }
            result[statusName].push(task);
        });
        return result;
    }

    async addStatus(status: types.Status) {
        var statusName = status.status.toLowerCase();
        if (this.statusList[statusName] === undefined) {
            this.statusList[statusName] = status;
        }
    }
}