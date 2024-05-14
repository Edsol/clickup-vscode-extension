import * as vscode from 'vscode';
import * as types from '../types';
import { TaskItem } from './items/task_item';
import { ApiWrapper } from '../lib/apiWrapper';

export class MyTaskListProvider implements vscode.TreeDataProvider<vscode.TreeItem> {

    apiwrapper: ApiWrapper;
    teams: types.Team[];
    userId: string;

    constructor(apiWrapper: ApiWrapper, teams: Array<types.Team>, userId: string) {
        this.apiwrapper = apiWrapper;
        this.userId = userId;
        this.teams = teams;
    }

    getTreeItem(element: any): vscode.TreeItem {
        return element;
    }

    async getChildren(element?: (types.Space)): Promise<(vscode.TreeItem)[]> {
        const resolve: Array<TaskItem> = [];

        for (const team of this.teams) {
            const tasks: Array<types.Task> = await this.apiwrapper.getMyTask(team.id, this.userId);
            for (const task of tasks) {
                resolve.push(new TaskItem(task));
            }

        }

        return Promise.resolve(resolve);
    }
}